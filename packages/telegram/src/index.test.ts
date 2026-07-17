import { describe, expect, it } from "vitest";
import {
  buildTelegramCheckUsageReply,
  buildTelegramHelpReply,
  buildTelegramSettingsReply,
  buildTelegramStartReply,
  buildTelegramTopReply,
  listMockTelegramGroups,
  listTelegramCommands,
} from "./index";

describe("telegram contract", () => {
  it("builds brand-safe start and help replies in zh by default", () => {
    expect(buildTelegramStartReply()).toContain("买币前，先查 CA。");
    expect(buildTelegramStartReply()).toContain("优先 SOL / BNB");
    expect(buildTelegramStartReply()).toContain("不是代币");
    expect(buildTelegramHelpReply()).toContain("/check <CA>");
    expect(listTelegramCommands().map((item) => item.command)).toEqual([
      "/start",
      "/help",
      "/check <CA>",
      "/top",
      "/settings",
    ]);
  });

  it("builds English start/help/top/usage when locale is en", () => {
    expect(buildTelegramStartReply("en")).toContain("Before you buy, check the CA.");
    expect(buildTelegramStartReply("en")).toContain("not a token");
    expect(buildTelegramHelpReply("en")).toContain("Commands:");
    expect(buildTelegramTopReply("en")).toContain("High-risk CA board");
    expect(buildTelegramCheckUsageReply("en")).toMatch(/\/check <CA>/i);
    expect(listTelegramCommands("en")[0]?.description).toMatch(/Welcome/i);
  });

  it("lists mock Telegram groups as defensive copies", () => {
    const groups = listMockTelegramGroups();
    groups[0]!.title = "mutated";

    expect(listMockTelegramGroups()[0]).toMatchObject({
      title: "SOL / BNB Alpha Group",
      autoDetectEnabled: false,
      highRiskAlerts: true,
      dailyCheckLimit: 100,
    });
  });

  it("lists Telegram commands as defensive copies", () => {
    const commands = listTelegramCommands();
    commands[0]!.description = "mutated";

    expect(listTelegramCommands()[0]).toEqual({
      command: "/start",
      description: "查看 ChainVigil AI 欢迎语和 CA 安检入口。",
    });
  });

  it("builds settings replies from group settings", () => {
    const reply = buildTelegramSettingsReply("-1001000000002");

    expect(reply).toContain("Meme Watch CN");
    expect(reply).toContain("自动检测 CA：关闭");
    expect(reply).toContain("高危提醒：开启");
  });

  it("builds English settings replies", () => {
    const reply = buildTelegramSettingsReply("-1001000000002", "en");
    expect(reply).toContain("Group settings skeleton");
    expect(reply).toContain("Auto-detect CA: off");
  });
});
