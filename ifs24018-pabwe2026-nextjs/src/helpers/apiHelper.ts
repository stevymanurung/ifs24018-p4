import { DELCOM_BASEURL } from "../lib/config";

const TOKEN_KEY = "accessToken";

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = (): void => localStorage.removeItem(TOKEN_KEY);

// Aset (foto/cover) dilayani dari origin server API, path-nya relatif (mis. img/...)
export const assetUrl = (path: string): string =>
  path.startsWith("http") ? path : `${new URL(DELCOM_BASEURL).origin}/${path}`;

interface FetchOptions {
  method?: string;
  params?: Record<string, string | number | null | undefined>;
  body?: Record<string, string | number> | FormData;
}

export async function apiFetch(
  path: string,
  { method = "GET", params = {}, body }: FetchOptions = {}
) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
  const url = `${DELCOM_BASEURL}${path}${query ? `?${query}` : ""}`;

  const token = getAccessToken();
  const init: RequestInit = {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
  if (body) {
    init.body =
      body instanceof FormData
        ? body
        : new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)]));
  }

  const response = await fetch(url, init);
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message);
  }
  return json;
}
