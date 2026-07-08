import { describe, expect, it } from "vitest";
import { appendReferralParam, buildTrackedShareText } from "./share";

describe("share helpers", () => {
  it("adds or replaces a referral code on report URLs", () => {
    expect(appendReferralParam("http://localhost:3000/token/base/0x123", "share")).toBe(
      "http://localhost:3000/token/base/0x123?ref=share",
    );
    expect(appendReferralParam("http://localhost:3000/token/base/0x123?ref=old", "new")).toBe(
      "http://localhost:3000/token/base/0x123?ref=new",
    );
  });

  it("replaces the original report URL in share text", () => {
    expect(
      buildTrackedShareText(
        "ChainVigil AI http://localhost:3000/token/base/0x123",
        "http://localhost:3000/token/base/0x123",
        "http://localhost:3000/token/base/0x123?ref=share",
      ),
    ).toBe("ChainVigil AI http://localhost:3000/token/base/0x123?ref=share");
  });
});
