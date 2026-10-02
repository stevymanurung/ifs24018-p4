import { useSyncExternalStore } from "react";
import { getAccessToken } from "../helpers/apiHelper";

const subscribe = () => () => {};

// Token hanya ada di browser. Di server nilainya undefined ("belum diperiksa"),
// null = tidak ada token, string = token tersedia. Aman untuk SSR/hidrasi.
export default function useAccessToken() {
  return useSyncExternalStore<string | null | undefined>(subscribe, getAccessToken, () => undefined);
}
