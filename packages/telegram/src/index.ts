import type { TelegramGroupSettings } from "@chainvigil/types";

const telegramCommands = [
  { command: "/start", description: "查看 ChainVigil AI 欢迎语和 CA 安检入口。" },
  { command: "/help", description: "查看群内可用命令。" },
  { command: "/check 0x...", description: "提交 EVM 合约地址，生成 mock 风险报告。" },
  { command: "/top", description: "查看高危 CA 榜单 mock。" },
  { command: "/settings", description: "查看群设置 skeleton。" },
] as const;

const mockTelegramGroups = [
  {
    id: "tg-base-alpha",
    telegramChatId: "-1001000000001",
    title: "Base Alpha Group",
    autoDetectEnabled: false,
    highRiskAlerts: true,
    dailyCheckLimit: 100,
    language: "zh",
    checksToday: 128,
    highRiskAlertsToday: 12,
    lastCheckedAt: "2026-07-08T00:30:00.000Z",
  },
  {
    id: "tg-meme-watch-cn",
    telegramChatId: "-1001000000002",
    title: "Meme Watch CN",
    autoDetectEnabled: false,
    highRiskAlerts: true,
    dailyCheckLimit: 100,
    language: "zh",
    checksToday: 86,
    highRiskAlertsToday: 9,
    lastCheckedAt: "2026-07-08T00:45:00.000Z",
  },
] satisfies TelegramGroupSettings[];

export function listTelegramCommands() {
  return telegramCommands;
}

export function buildTelegramStartReply() {
  return [
    "ChainVigil AI｜链哨 AI",
    "买币前，先查 CA。",
    "",
    "发送 /check 0x... 可 mock 查询 Token 风险报告。",
    "发送 /help 查看全部可用命令。",
  ].join("\n");
}

export function buildTelegramHelpReply() {
  return [
    "ChainVigil AI｜链哨 AI",
    "",
    "可用命令：",
    ...telegramCommands
      .filter((item) => item.command !== "/start")
      .map((item) => `${item.command} - ${item.description}`),
    "",
    "买币前，先查 CA。",
  ].join("\n");
}

export function listMockTelegramGroups(): TelegramGroupSettings[] {
  return mockTelegramGroups.map((group) => ({ ...group }));
}

export function getMockTelegramGroup(chatId: number | string | undefined): TelegramGroupSettings {
  const id = chatId === undefined ? undefined : String(chatId);

  return listMockTelegramGroups().find((group) => group.telegramChatId === id) ?? listMockTelegramGroups()[0]!;
}

export function buildTelegramSettingsReply(chatId: number | string | undefined) {
  const group = getMockTelegramGroup(chatId);

  return [
    "群设置 skeleton",
    `群组：${group.title}`,
    `自动检测 CA：${group.autoDetectEnabled ? "开启" : "关闭"}`,
    `高危提醒：${group.highRiskAlerts ? "开启" : "关闭"}`,
    `每日检测上限：${group.dailyCheckLimit}`,
    `语言：${group.language === "zh" ? "中文" : "English"}`,
  ].join("\n");
}
