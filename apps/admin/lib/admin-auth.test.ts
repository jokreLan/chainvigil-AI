import { describe, expect, it } from "vitest";
import { isAdminAuthEnabled, verifyAdminBasicAuth } from "./admin-auth";

function basic(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

function decode(value: string): string {
  return Buffer.from(value, "base64").toString("utf8");
}

describe("admin basic auth", () => {
  it("keeps local admin open when no password is configured", () => {
    expect(isAdminAuthEnabled({})).toBe(false);
    expect(verifyAdminBasicAuth(null, {}, decode)).toEqual({ enabled: false, ok: true });
  });

  it("accepts the configured admin credentials", () => {
    expect(
      verifyAdminBasicAuth(
        basic("ops", "secret-password"),
        { username: "ops", password: "secret-password" },
        decode,
      ),
    ).toEqual({ enabled: true, ok: true });
  });

  it("rejects missing or invalid credentials when enabled", () => {
    expect(verifyAdminBasicAuth(null, { password: "secret-password" }, decode)).toEqual({
      enabled: true,
      ok: false,
    });
    expect(verifyAdminBasicAuth(basic("admin", "wrong"), { password: "secret-password" }, decode))
      .toEqual({
        enabled: true,
        ok: false,
      });
  });
});
