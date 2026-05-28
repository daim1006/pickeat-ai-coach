/**
 * n8n Webhook 호출 유틸리티
 *
 * 환경변수 VITE_N8N_WEBHOOK_URL 에 설정된 n8n Webhook 엔드포인트로
 * POST 요청을 보내는 함수를 제공합니다.
 */

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

export interface CallN8nOptions {
  /** 추가 헤더 (Content-Type: application/json 은 기본 포함) */
  headers?: Record<string, string>;
  /** 요청 타임아웃 (ms). 기본 30초 */
  timeoutMs?: number;
  /** 응답을 JSON 으로 파싱할지 여부. 기본 true */
  parseJson?: boolean;
  /** AbortSignal 직접 전달 */
  signal?: AbortSignal;
}

export class N8nError extends Error {
  status?: number;
  body?: unknown;
  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "N8nError";
    this.status = status;
    this.body = body;
  }
}

/**
 * n8n Webhook 으로 POST 요청을 보냅니다.
 *
 * @param payload  JSON 으로 직렬화 가능한 본문
 * @param options  헤더 / 타임아웃 / 파싱 옵션
 * @returns        파싱된 응답 (parseJson=false 이면 raw text)
 */
export async function callN8n<TResponse = unknown, TPayload = unknown>(
  payload: TPayload,
  options: CallN8nOptions = {},
): Promise<TResponse> {
  if (!WEBHOOK_URL) {
    throw new N8nError(
      "VITE_N8N_WEBHOOK_URL 환경변수가 설정되지 않았습니다.",
    );
  }

  const { headers, timeoutMs = 30_000, parseJson = true, signal } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // 외부 signal 이 abort 되면 내부 controller 도 abort
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      let errBody: unknown;
      try {
        errBody = await res.text();
      } catch {
        // ignore
      }
      throw new N8nError(
        `n8n webhook 요청 실패: ${res.status} ${res.statusText}`,
        res.status,
        errBody,
      );
    }

    if (!parseJson) {
      return (await res.text()) as unknown as TResponse;
    }

    const text = await res.text();
    if (!text) return undefined as unknown as TResponse;

    try {
      return JSON.parse(text) as TResponse;
    } catch {
      return text as unknown as TResponse;
    }
  } catch (err) {
    if (err instanceof N8nError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new N8nError("n8n webhook 요청이 타임아웃되었습니다.");
    }
    throw new N8nError(
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
