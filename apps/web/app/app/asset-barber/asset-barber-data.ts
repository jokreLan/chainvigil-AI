export type ScanProfile = "risk" | "clean" | "empty" | "failed";
export type ChainScope = "all" | "sol" | "bnb";
export type ContentLocale = "zh" | "en";

export type CleanupAction = {
  id: string;
  title: string;
  detail: string;
  recommendation: string;
  tone: "danger" | "warning" | "safe";
};

export type ScanReport = {
  profile: Exclude<ScanProfile, "failed">;
  title: string;
  cleanliness: number;
  summary: string;
  metrics: Array<{ label: string; value: string; tone: string }>;
  sol: {
    emptyAccounts: number;
    recoverableSol: string;
    spamNfts: number;
    dust: Array<{ name: string; amount: string; risk: string; action: string }>;
  };
  bnb: Array<{
    spender: string;
    allowance: string;
    risk: "High" | "Medium" | "Low";
    infinite: boolean;
    lastUsed: string;
    advice: string;
  }>;
  actions: CleanupAction[];
};

export const scanStepsZh = ["读取钱包资产", "检查 SOL Token Accounts", "检查 BNB 授权风险", "生成 AI 清理报告"];
export const scanStepsEn = [
  "Read wallet assets",
  "Check SOL token accounts",
  "Check BNB approval risk",
  "Generate AI cleanup report",
];

/** @deprecated use scanStepsFor(locale) */
export const scanSteps = scanStepsZh;

export function scanStepsFor(locale: ContentLocale = "zh") {
  return locale === "en" ? scanStepsEn : scanStepsZh;
}

export const demoAddresses: Record<ScanProfile, string> = {
  risk: "7J3qkJ6mBZY2oYvM8vB1PpGQmP6dYfZQ4pvx8qH2K5Fu",
  clean: "5oM3mD9qC4sW1L8dN2pK7vR6uT9xY3fG5hJ8bQ1cE4a",
  empty: "9fV2rK4pD7wX1mN8qT3cG6hJ5bY9uL2sE4oP7aZ1kC6d",
  failed: "fail-demo-wallet-address",
};

function pick(locale: ContentLocale, zh: string, en: string) {
  return locale === "en" ? en : zh;
}

function buildReports(locale: ContentLocale): Record<Exclude<ScanProfile, "failed">, ScanReport> {
  return {
    risk: {
      profile: "risk",
      title: pick(locale, "需要优先处理的演示钱包", "Demo wallet needing attention"),
      cleanliness: 72,
      summary: pick(
        locale,
        "最大问题是 2 个无限额度的 BNB 授权与 3 个空 SOL Token Account。优先复查高危 Spender；粉尘资产不值得为其付出额外手续费。",
        "Main issues: 2 unlimited BNB approvals and 3 empty SOL token accounts. Review risky spenders first; dust is rarely worth extra fees.",
      ),
      metrics: [
        { label: pick(locale, "总风险项", "Risk items"), value: "8", tone: "#fb7185" },
        { label: pick(locale, "可回收 SOL", "Recoverable SOL"), value: "0.0061", tone: "#a5b4fc" },
        { label: pick(locale, "高危授权", "High-risk approvals"), value: "2", tone: "#fb923c" },
        { label: pick(locale, "粉尘资产", "Dust assets"), value: "5", tone: "#fbbf24" },
        { label: pick(locale, "推荐动作", "Recommended actions"), value: "4", tone: "#34d399" },
      ],
      sol: {
        emptyAccounts: 3,
        recoverableSol: "0.0061 SOL",
        spamNfts: 2,
        dust: [
          {
            name: "BONK-CLAIM",
            amount: "0.00004 SOL",
            risk: pick(locale, "可疑空投链接", "Suspicious airdrop link"),
            action: pick(locale, "不要交互，隐藏即可", "Do not interact — hide"),
          },
          {
            name: "USDQ",
            amount: "0.12 USDQ",
            risk: pick(locale, "低流动性粉尘", "Low-liquidity dust"),
            action: pick(locale, "不建议归集", "Sweep not recommended"),
          },
          {
            name: "MemeDrop",
            amount: "1.2",
            risk: pick(locale, "未知铸造方", "Unknown minter"),
            action: pick(locale, "人工确认后再处理", "Confirm manually before action"),
          },
        ],
      },
      bnb: [
        {
          spender: "0x4f7A…91b2",
          allowance: "Unlimited",
          risk: "High",
          infinite: true,
          lastUsed: pick(locale, "从未识别", "Never seen"),
          advice: pick(locale, "建议撤销：无可验证业务用途", "Revoke: no verifiable use"),
        },
        {
          spender: "0x91D3…e730",
          allowance: "Unlimited",
          risk: "High",
          infinite: true,
          lastUsed: pick(locale, "183 天前", "183 days ago"),
          advice: pick(locale, "建议撤销：长期未使用", "Revoke: long unused"),
        },
        {
          spender: "0x8B12…4aD1",
          allowance: "250 USDT",
          risk: "Medium",
          infinite: false,
          lastUsed: pick(locale, "7 天前", "7 days ago"),
          advice: pick(locale, "需要用户确认：可能仍在使用", "Confirm: may still be in use"),
        },
        {
          spender: "0x2c8E…0B4c",
          allowance: "20 BUSD",
          risk: "Low",
          infinite: false,
          lastUsed: pick(locale, "今天", "Today"),
          advice: pick(locale, "保留：近期常用协议", "Keep: recently used protocol"),
        },
      ],
      actions: [
        {
          id: "approval-1",
          title: pick(locale, "复查并撤销 2 个无限授权", "Review & revoke 2 unlimited approvals"),
          detail: pick(locale, "涉及高危或长期未使用的 BNB Spender。", "High-risk or long-unused BNB spenders."),
          recommendation: pick(locale, "建议处理", "Review"),
          tone: "danger",
        },
        {
          id: "sol-accounts",
          title: pick(locale, "查看 3 个空 Token Account", "Review 3 empty token accounts"),
          detail: pick(
            locale,
            "预计可回收 0.0061 SOL；本版本不会执行关闭账户。",
            "Est. 0.0061 SOL recoverable; this version never closes accounts.",
          ),
          recommendation: pick(locale, "需要确认", "Confirm needed"),
          tone: "warning",
        },
        {
          id: "spam-nft",
          title: pick(locale, "隐藏 2 个可疑垃圾 NFT", "Hide 2 suspicious spam NFTs"),
          detail: pick(
            locale,
            "含外部领取诱导；不要访问其中链接。",
            "Includes claim lures — do not open those links.",
          ),
          recommendation: pick(locale, "建议处理", "Review"),
          tone: "danger",
        },
        {
          id: "dust",
          title: pick(locale, "保留低价值粉尘资产", "Keep low-value dust"),
          detail: pick(
            locale,
            "预计处理成本高于价值，不建议归集或 Swap。",
            "Cleanup cost likely exceeds value — avoid sweep/swap.",
          ),
          recommendation: pick(locale, "保留", "Keep"),
          tone: "safe",
        },
      ],
    },
    clean: {
      profile: "clean",
      title: pick(locale, "较干净的演示钱包", "Cleaner demo wallet"),
      cleanliness: 91,
      summary: pick(
        locale,
        "未发现无限授权或恶意资产信号。仅有 1 个低价值粉尘资产，处理成本可能高于回收价值，建议保持不动。",
        "No unlimited approvals or malicious assets found. One low-value dust item — cleanup may cost more than recovery.",
      ),
      metrics: [
        { label: pick(locale, "总风险项", "Risk items"), value: "1", tone: "#34d399" },
        { label: pick(locale, "可回收 SOL", "Recoverable SOL"), value: "0.0020", tone: "#a5b4fc" },
        { label: pick(locale, "高危授权", "High-risk approvals"), value: "0", tone: "#34d399" },
        { label: pick(locale, "粉尘资产", "Dust assets"), value: "1", tone: "#fbbf24" },
        { label: pick(locale, "推荐动作", "Recommended actions"), value: "0", tone: "#34d399" },
      ],
      sol: {
        emptyAccounts: 1,
        recoverableSol: "0.0020 SOL",
        spamNfts: 0,
        dust: [
          {
            name: "TinyUSDC",
            amount: "0.03 USDC",
            risk: pick(locale, "低价值粉尘", "Low-value dust"),
            action: pick(locale, "不建议处理，成本不划算", "Not worth cleaning"),
          },
        ],
      },
      bnb: [
        {
          spender: "0x2c8E…0B4c",
          allowance: "20 BUSD",
          risk: "Low",
          infinite: false,
          lastUsed: pick(locale, "今天", "Today"),
          advice: pick(locale, "保留：近期常用协议", "Keep: recently used protocol"),
        },
      ],
      actions: [
        {
          id: "keep",
          title: pick(locale, "无需立即清理", "No cleanup needed now"),
          detail: pick(locale, "钱包没有足以覆盖执行成本的项目。", "Nothing covers execution costs."),
          recommendation: pick(locale, "保留", "Keep"),
          tone: "safe",
        },
      ],
    },
    empty: {
      profile: "empty",
      title: pick(locale, "空结果演示钱包", "Empty-result demo wallet"),
      cleanliness: 100,
      summary: pick(
        locale,
        "未检测到可评估的 SOL Token Account、粉尘资产或 BNB 授权。这个演示结果用于说明空状态，并不代表真实钱包绝对安全。",
        "No evaluable SOL token accounts, dust, or BNB approvals. Demo empty state — not a guarantee of real-wallet safety.",
      ),
      metrics: [
        { label: pick(locale, "总风险项", "Risk items"), value: "0", tone: "#34d399" },
        { label: pick(locale, "可回收 SOL", "Recoverable SOL"), value: "0", tone: "#a5b4fc" },
        { label: pick(locale, "高危授权", "High-risk approvals"), value: "0", tone: "#34d399" },
        { label: pick(locale, "粉尘资产", "Dust assets"), value: "0", tone: "#34d399" },
        { label: pick(locale, "推荐动作", "Recommended actions"), value: "0", tone: "#34d399" },
      ],
      sol: { emptyAccounts: 0, recoverableSol: "0 SOL", spamNfts: 0, dust: [] },
      bnb: [],
      actions: [],
    },
  };
}

export function reportFor(
  profile: Exclude<ScanProfile, "failed">,
  locale: ContentLocale = "zh",
): ScanReport {
  return buildReports(locale)[profile];
}

export function isLikelyWalletAddress(value: string) {
  const address = value.trim();
  return /^0x[a-fA-F0-9]{8,}$/.test(address) || /^[1-9A-HJ-NP-Za-km-z]{20,}$/.test(address);
}
