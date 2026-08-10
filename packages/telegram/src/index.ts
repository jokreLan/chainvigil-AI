import type { TelegramCommand, TelegramGroupSettings } from "@chainvigil/types";

export type TelegramLocale = "zh" | "en";

function normalizeLocale(locale?: string | null): TelegramLocale {
  return locale === "en" ? "en" : "zh";
}

const commandsByLocale: Record<TelegramLocale, TelegramCommand[]> = {
  zh: [
    { command: "/start", description: "查看 ChainVigil 欢迎语和 CA 安检入口。" },
    { command: "/help", description: "查看群内可用命令。" },
    {
      command: "/check <CA>",
      description: "提交 SOL 或 BNB Token 合约地址，生成人话风险报告（V0 可能为 mock）。",
    },
    { command: "/top", description: "查看高危 CA 榜单 mock。" },
    { command: "/settings", description: "查看群设置 skeleton。" },
  ],
  en: [
    { command: "/start", description: "Welcome message and CA check entry." },
    { command: "/help", description: "List available group commands." },
    {
      command: "/check <CA>",
      description: "Submit a SOL or BNB token CA for a plain-language risk report (V0 may be mock).",
    },
    { command: "/top", description: "Show high-risk CA board (mock)." },
    { command: "/settings", description: "Show group settings skeleton." },
  ],
};

const mockTelegramGroups = [
  {
    id: "tg-sol-bnb-alpha",
    telegramChatId: "-1001000000001",
    title: "SOL / BNB Alpha Group",
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

export function listTelegramCommands(locale?: string | null) {
  const lang = normalizeLocale(locale);
  return commandsByLocale[lang].map((item) => ({ ...item }));
}

export function buildTelegramStartReply(locale?: string | null) {
  if (normalizeLocale(locale) === "en") {
    return [
      "ChainVigil",
      "Before you buy, check the CA.",
      "",
      "Buy-before scan entry · SOL / BNB first",
      "Paste a contract in the group for plain results (block / high / caution).",
      "",
      "Send /check <CA> for a token risk report.",
      "Send /help for all commands.",
      "",
      "Note: V0 may be mock; reports include mode/confidence. Not investment advice.",
      "Vigil Points (VP) redeem protection perks — not a token.",
    ].join("\n");
  }

  return [
    "ChainVigil",
    "买币前，先查 CA。",
    "",
    "中文买前安检入口 · 优先 SOL / BNB",
    "在群里贴合约，拿人话结论（禁买 / 高危 / 谨慎）。",
    "",
    "发送 /check <CA> 查询 Token 风险报告。",
    "发送 /help 查看全部命令。",
    "",
    "说明：V0 可能为 mock；报告含 mode/confidence，不构成投资建议。",
    "哨点 VP 用于兑换防护权益，不是代币。",
  ].join("\n");
}

export function buildTelegramHelpReply(locale?: string | null) {
  const lang = normalizeLocale(locale);
  if (lang === "en") {
    return [
      "ChainVigil",
      "",
      "Commands:",
      ...listTelegramCommands("en")
        .filter((item) => item.command !== "/start")
        .map((item) => `${item.command} - ${item.description}`),
      "",
      "Before you buy, check the CA.",
    ].join("\n");
  }

  return [
    "ChainVigil",
    "",
    "可用命令：",
    ...listTelegramCommands("zh")
      .filter((item) => item.command !== "/start")
      .map((item) => `${item.command} - ${item.description}`),
    "",
    "买币前，先查 CA。",
  ].join("\n");
}

export function buildTelegramTopReply(locale?: string | null) {
  if (normalizeLocale(locale) === "en") {
    return [
      "High-risk CA board (mock)",
      "1. SOL So111...1112｜Caution｜Authority & LP need review",
      "2. BNB 0x2222...2220｜Block｜Blacklist authority",
      "",
      "Full board: http://localhost:3000/leaderboard/high-risk-tokens",
    ].join("\n");
  }

  return [
    "高危 CA 榜单（mock）",
    "1. SOL So111...1112｜谨慎｜权限与流动性待复核",
    "2. BNB 0x2222...2220｜禁买｜黑名单权限",
    "",
    "完整榜单：http://localhost:3000/leaderboard/high-risk-tokens",
  ].join("\n");
}

export function buildTelegramCheckUsageReply(locale?: string | null) {
  if (normalizeLocale(locale) === "en") {
    return "Send /check <CA> to run a ChainVigil scan. SOL and BNB first.";
  }
  return "请发送 /check <CA> 调用 ChainVigil 安检，优先支持 SOL 和 BNB。";
}

export function listMockTelegramGroups(): TelegramGroupSettings[] {
  return mockTelegramGroups.map((group) => ({ ...group }));
}

export function getMockTelegramGroup(chatId: number | string | undefined): TelegramGroupSettings {
  const id = chatId === undefined ? undefined : String(chatId);

  return (
    listMockTelegramGroups().find((group) => group.telegramChatId === id) ??
    listMockTelegramGroups()[0]!
  );
}

export function buildTelegramSettingsReply(chatId: number | string | undefined, locale?: string | null) {
  const group = getMockTelegramGroup(chatId);
  const lang = normalizeLocale(locale ?? group.language);

  if (lang === "en") {
    return [
      "Group settings skeleton",
      `Group: ${group.title}`,
      `Auto-detect CA: ${group.autoDetectEnabled ? "on" : "off"}`,
      `High-risk alerts: ${group.highRiskAlerts ? "on" : "off"}`,
      `Daily check limit: ${group.dailyCheckLimit}`,
      `Language: ${group.language === "zh" ? "Chinese" : "English"}`,
    ].join("\n");
  }

  return [
    "群设置 skeleton",
    `群组：${group.title}`,
    `自动检测 CA：${group.autoDetectEnabled ? "开启" : "关闭"}`,
    `高危提醒：${group.highRiskAlerts ? "开启" : "关闭"}`,
    `每日检测上限：${group.dailyCheckLimit}`,
    `语言：${group.language === "zh" ? "中文" : "English"}`,
  ].join("\n");
}
