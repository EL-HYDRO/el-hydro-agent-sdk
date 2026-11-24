export const API_BASE: string;
export type PublicData = Record<string, unknown>;
export interface ClientOptions { fetchImpl?: typeof fetch; timeoutMs?: number }
export class ElHydroApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly retryAfter: string | null;
  constructor(message: string, options?: {status?: number | null; code?: string; retryAfter?: string | null; cause?: unknown});
}
export class ElHydroClient {
  constructor(options?: ClientOptions);
  prices(): Promise<PublicData>;
  search(q: string, options?: {limit?: number}): Promise<PublicData>;
  travel(): Promise<PublicData>;
  hours(): Promise<PublicData>;
  company(): Promise<PublicData>;
  services(): Promise<PublicData>;
  health(): Promise<PublicData>;
}
