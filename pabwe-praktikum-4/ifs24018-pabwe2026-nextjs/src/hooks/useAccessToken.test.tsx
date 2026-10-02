import { renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { putAccessToken } from "../helpers/apiHelper";
import useAccessToken from "./useAccessToken";

function Probe() {
  return <span>{String(useAccessToken())}</span>;
}

describe("useAccessToken", () => {
  it("null bila tidak ada token, string bila ada", () => {
    expect(renderHook(() => useAccessToken()).result.current).toBeNull();
    putAccessToken("tok");
    expect(renderHook(() => useAccessToken()).result.current).toBe("tok");
  });

  it("undefined saat dirender di server (belum diperiksa)", () => {
    expect(renderToString(<Probe />)).toContain("undefined");
  });
});
