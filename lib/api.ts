/**
 * Backend integration points.
 *
 * None of these talk to a server yet. Every function resolves with
 * `{ ok: false, reason: "not-connected" }` so the UI can tell the visitor
 * honestly that the action is a demo. Replace each body with a real
 * fetch() to your API (or a Server Action) and return `{ ok: true }`.
 */
/* eslint-disable @typescript-eslint/no-unused-vars -- stubs: parameters document the future API contract */
export type ApiResult = { ok: true } | { ok: false; reason: "not-connected" | "error" };

const NOT_CONNECTED: ApiResult = { ok: false, reason: "not-connected" };

export async function login(_input: { email: string; password: string }): Promise<ApiResult> {
  return NOT_CONNECTED;
}
export async function register(_input: { name: string; email: string; password: string }): Promise<ApiResult> {
  return NOT_CONNECTED;
}
export async function requestPasswordReset(_input: { email: string }): Promise<ApiResult> {
  return NOT_CONNECTED;
}
export async function sendContactMessage(_input: { name: string; email: string; subject: string; message: string }): Promise<ApiResult> {
  return NOT_CONNECTED;
}
export async function subscribeNewsletter(_input: { email: string }): Promise<ApiResult> {
  return NOT_CONNECTED;
}
export async function enrollInCourse(_courseId: string): Promise<ApiResult> {
  return NOT_CONNECTED; // payments / coupons / subscriptions plug in here
}
