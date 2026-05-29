/**
 * n8n Webhook 호출 유틸리티
 *
 * 각 기능별 n8n Webhook 엔드포인트와, 해당 엔드포인트로 POST 요청을 보내는
 * 헬퍼 함수들을 제공합니다.
 */

export const N8N_WEBHOOKS = {
  /** 영양 성분표 스캔 및 분석 */
  scan: "https://upstage15.app.n8n.cloud/webhook/scan",
  /** 음식 스캔 (영양/원재료 동시 분석) */
  scanFood: "https://upstage15.app.n8n.cloud/webhook/scan-food",
  /** 누적 섭취량 업데이트 */
  saveIntake: "https://upstage15.app.n8n.cloud/webhook/saveIntake",
  /** 스캔 기록 저장 */
  saveScan: "https://upstage15.app.n8n.cloud/webhook/saveScan",
  /** 스캔 기록 조회 */
  historyInquire: "https://upstage15.app.n8n.cloud/webhook/historyInquire",
  /** 챗봇 */
  chat: "https://upstage15.app.n8n.cloud/webhook/chat",
} as const;

export type N8nWebhookKey = keyof typeof N8N_WEBHOOKS;

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
 * 임의의 n8n Webhook URL 로 POST 요청을 보냅니다.
 */
export async function postToN8n<TResponse = unknown, TPayload = unknown>(
  url: string,
  payload: TPayload,
  options: CallN8nOptions = {},
): Promise<TResponse> {
  const { headers, timeoutMs = 30_000, parseJson = true, signal } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(url, {
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

/** 키로 지정한 n8n Webhook 으로 POST 요청을 보냅니다. */
export function callN8n<TResponse = unknown, TPayload = unknown>(
  key: N8nWebhookKey,
  payload: TPayload,
  options?: CallN8nOptions,
): Promise<TResponse> {
  return postToN8n<TResponse, TPayload>(N8N_WEBHOOKS[key], payload, options);
}

// ---------------------------------------------------------------------------
// 기능별 헬퍼
// ---------------------------------------------------------------------------

export interface ScanPayload {
  /** data URL 또는 base64 문자열 */
  image: string;
  filename?: string;
  mimeType?: string;
}

/** 영양 성분표 스캔 및 분석 */
export function scanNutrition<T = unknown>(payload: ScanPayload, options?: CallN8nOptions) {
  return callN8n<T, ScanPayload>("scan", payload, options);
}

export interface ScanFoodPayload {
  image_nutrition: string;
  image_ingredients: string;
  user_health_goal: string;
}

export interface ScanFoodResponse {
  success: boolean;
  product_name?: string;
  food_type?: string;
  nutrition?: unknown;
  ingredients?: string;
  warning_ingredients?: unknown[];
  verdict?: string;
  ai_comment?: string;
  [k: string]: unknown;
}

/** 음식 스캔 (영양/원재료 동시 분석) */
export function scanFood(payload: ScanFoodPayload, options?: CallN8nOptions) {
  return callN8n<ScanFoodResponse, ScanFoodPayload>("scanFood", payload, options);
}

/** 누적 섭취량 업데이트 */
export function saveIntake<T = unknown, P = unknown>(payload: P, options?: CallN8nOptions) {
  return callN8n<T, P>("saveIntake", payload, options);
}

/** 스캔 기록 저장 */
export function saveScan<T = unknown, P = unknown>(payload: P, options?: CallN8nOptions) {
  return callN8n<T, P>("saveScan", payload, options);
}

/** 스캔 기록 조회 */
export function inquireHistory<T = unknown, P = unknown>(payload: P = {} as P, options?: CallN8nOptions) {
  return callN8n<T, P>("historyInquire", payload, options);
}

export interface ChatPayload {
  message: string;
  history?: Array<{ role: "user" | "ai"; text: string }>;
}

/** 챗봇 */
export function chatWithBot<T = { reply?: string; text?: string; message?: string }>(
  payload: ChatPayload,
  options?: CallN8nOptions,
) {
  return callN8n<T, ChatPayload>("chat", payload, options);
}
