import { describe, expect, it } from "vitest";
import {
  buildTelegramHelpReply,
  buildTelegramSettingsReply,
  buildTelegramStartReply,
  listMockTelegramGroups,
  listTelegramCommands,
} from "./index";

describe("telegram contract", () => {
  it("builds brand-safe start and help replies", () => {
    expect(buildTelegramStartReply()).toContain("买币前，先查 CA。");
    expect(buildTelegramHelpReply()).toContain("/check 0x...");
    expect(listTelegramCommands().map((item) => item.command)).toEqual([
      "/start",
      "/help",
      "/check 0x...",
      "/top",
      "/settings",
    ]);
  });

  it("lists mock Telegram groups as defensive copies", () => {
    const groups = listMockTelegramGroups();
    groups[0]!.title = "mutated";

    expect(listMockTelegramGroups()[0]).toMatchObject({
      title: "Base Alpha Group",
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
});
