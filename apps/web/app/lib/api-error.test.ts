import { describe, expect, it } from "vitest";
import { readApiErrorMessage } from "./api-error";

describe("readApiErrorMessage", () => {
  it("uses the API error message when present", async () => {
    const response = new Response(
      JSON.stringify({
        error: {
          code: "BAD_REQUEST",
          message: "请输入有效的 EVM 合约地址。",
          field: "input",
        },
      }),
      { status: 400 },
    );

    await expect(readApiErrorMessage(response, "fallback")).resolves.toBe(
      "请输入有效的 EVM 合约地址。",
    );
  });

  it("falls back when the body is not a ChainVigil API error", async () => {
    const response = new Response("service unavailable", { status: 503 });

    await expect(readApiErrorMessage(response, "稍后重试。")).resolves.toBe("稍后重试。");
  });
});
