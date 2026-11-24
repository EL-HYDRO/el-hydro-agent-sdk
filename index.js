/** Read-only client for the official public EL-HYDRO API. */
export const API_BASE = 'https://www.hydraulika.zgora.pl/wp-json/elh-agent/v1/';
export class ElHydroApiError extends Error {
  constructor(message, {status = null, code = 'client_error', retryAfter = null, cause} = {}) {
    super(message, {cause});
    this.name = 'ElHydroApiError';
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}
export class ElHydroClient {
  #fetch;
  #timeout;
  constructor({fetchImpl = globalThis.fetch, timeoutMs = 15000} = {}) {
    if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 120000) throw new RangeError('timeoutMs must be 1–120000');
    this.#fetch = fetchImpl;
    this.#timeout = timeoutMs;
  }
  async #get(route, params = {}) {
    const url = new URL(route, API_BASE);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
    const signal = AbortSignal.timeout(this.#timeout);
    let response, text;
    try {
      response = await this.#fetch(url, {method: 'GET', headers: {Accept: 'application/json'}, redirect: 'error', signal, credentials: 'omit'});
      text = await response.text();
    } catch (cause) {
      throw new ElHydroApiError(signal.aborted ? 'Request timed out' : 'API request failed', {code: signal.aborted ? 'timeout' : 'network_error', status: response?.status ?? null, cause});
    }
    const retryAfter = response.headers.get('retry-after');
    const type = response.headers.get('content-type') || '';
    let data;
    try {
      if (!/^application\/(?:json|[\w.+-]+\+json)(?:\s*;|$)/i.test(type)) throw new Error('Unexpected content type');
      data = JSON.parse(text);
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Expected JSON object');
    } catch (cause) {
      throw new ElHydroApiError('API returned an invalid JSON response', {status: response.status, code: 'invalid_response', retryAfter, cause});
    }
    if (!response.ok) throw new ElHydroApiError(typeof data.message === 'string' ? data.message : `HTTP ${response.status}`, {status: response.status, code: typeof data.code === 'string' ? data.code : 'http_error', retryAfter});
    return data;
  }
  prices() { return this.#get('prices'); }
  travel() { return this.#get('travel'); }
  hours() { return this.#get('hours'); }
  company() { return this.#get('company'); }
  services() { return this.#get('services'); }
  health() { return this.#get('health'); }
  search(q, {limit = 10} = {}) {
    if (typeof q !== 'string' || !/[\p{L}\p{N}]/u.test(q) || new TextEncoder().encode(q).length > 120) throw new TypeError('q must contain a letter or digit and be at most 120 UTF-8 bytes');
    if (!Number.isInteger(limit) || limit < 1 || limit > 30) throw new RangeError('limit must be an integer from 1 to 30');
    return this.#get('search', {q, limit});
  }
}
