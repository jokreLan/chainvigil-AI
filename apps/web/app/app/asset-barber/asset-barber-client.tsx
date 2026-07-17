"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "../../i18n/locale-context";
import { MobileNav } from "../../ui/mobile-nav";
import {
  demoAddresses,
  isLikelyWalletAddress,
  reportFor,
  scanStepsFor,
  type ChainScope,
  type CleanupAction,
  type ScanProfile,
} from "./asset-barber-data";

type Screen = "setup" | "scanning" | "result" | "failed";
type Modal = "action" | "upgrade" | null;

const recoverable = [
  { symbol: "UNI", name: "Uniswap Dust", amount: "0.12 UNI", value: "~$0.85" },
  { symbol: "LINK", name: "Chainlink Dust", amount: "0.05 LINK", value: "~$0.70" },
];

const hiddenAssets = [
  { icon: "◍", name: "Free PEPE Ai...", type: "Spam Token" },
  { icon: "▣", name: "Claim 1000 U...", type: "Spam NFT" },
];

const blockedAssets = [
  { icon: "✖", name: "Fake USDC", tag: "Honeypot", address: "0x1234...abcd", copy: "Interacting with this contract may drain your wallet. Leave it alone.", tone: "#EF4444" },
  { icon: "⚠", name: "Unknown LP", tag: "High Risk", address: "0x9876...def0", copy: "Malicious code detected in transfer function.", tone: "#F97316" },
];

export function AssetBarberClient() {
  const { locale, t } = useLocale();
  const contentLocale = locale === "en" ? "en" : "zh";
  const scanSteps = scanStepsFor(contentLocale);
  const [screen, setScreen] = useState<Screen>("setup");
  const [profile, setProfile] = useState<ScanProfile>("risk");
  const [address, setAddress] = useState(demoAddresses.risk);
  const [scope, setScope] = useState<ChainScope>("all");
  const [connected, setConnected] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Modal>(null);
  const [pendingAction, setPendingAction] = useState<CleanupAction | null>(null);

  const profileLabels: Record<ScanProfile, string> = {
    risk: t("barber.profileRisk"),
    clean: t("barber.profileClean"),
    empty: t("barber.profileEmpty"),
    failed: t("barber.profileFailed"),
  };

  useEffect(() => {
    if (screen !== "scanning") return;
    setStep(0);
    const timers = scanSteps.map((_, index) => window.setTimeout(() => setStep(index + 1), (index + 1) * 650));
    const finish = window.setTimeout(() => setScreen(profile === "failed" ? "failed" : "result"), 3100);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(finish);
    };
  }, [profile, screen, scanSteps]);

  const report = reportFor(profile === "failed" ? "risk" : profile, contentLocale);
  const startScan = () => {
    if (!isLikelyWalletAddress(address) && profile !== "failed") {
      setError(t("barber.invalidAddr"));
      return;
    }
    setError("");
    setScreen("scanning");
  };
  const chooseProfile = (next: ScanProfile) => {
    setProfile(next);
    setAddress(demoAddresses[next]);
    setError("");
  };
  const requestAction = (action: CleanupAction) => {
    setPendingAction(action);
    setModal("action");
  };

  return (
    <main className="min-h-screen bg-[#0A0B0F] pb-28 text-[#e4e1ed] selection:bg-[#8083ff] selection:text-[#0d0096] md:pb-8">
      <TopBar />
      <div className="mx-auto max-w-[1280px] px-4 pt-24 md:px-6">
        {screen === "setup" && (
          <Setup
            address={address}
            scope={scope}
            connected={connected}
            profile={profile}
            error={error}
            onAddress={setAddress}
            onScope={setScope}
            onConnect={() => setConnected(true)}
            onProfile={chooseProfile}
            onScan={startScan}
            onBack={() => setScreen("result")}
          />
        )}
        {screen === "scanning" && (
          <Scanning step={step} address={address} scope={scope} steps={scanSteps} />
        )}
        {screen === "failed" && <Failed onRetry={() => setScreen("setup")} onBack={() => setScreen("result")} />}
        {screen === "result" && (
          <Results
            report={report}
            scope={scope}
            onScope={setScope}
            onScan={() => setScreen("setup")}
            onAction={requestAction}
            onUpgrade={() => setModal("upgrade")}
          />
        )}
      </div>
      {modal && <SafetyModal type={modal} action={pendingAction} onClose={() => setModal(null)} />}
      <MobileNav active="wallet" />
    </main>
  );
}

function TopBar() {
  const { t } = useLocale();
  return (
    <header className="fixed left-0 top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#262932] bg-[#0A0B0F]/95 px-4 backdrop-blur md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-[#c0c1ff]">◎</span>
        <span className="font-semibold tracking-tight text-[#e4e1ed]">{t("brand.name")}</span>
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <Link href="/wallet-check" className="text-[#c7c4d7]">
          {t("nav.walletShort")}
        </Link>
        <Link href="/app/approvals" className="text-[#c0c1ff]">
          {t("ws.modApprovals")}
        </Link>
      </div>
    </header>
  );
}

function Results({
  report,
  scope,
  onScope,
  onScan,
  onAction,
  onUpgrade,
}: {
  report: ReturnType<typeof reportFor>;
  scope: ChainScope;
  onScope: (scope: ChainScope) => void;
  onScan: () => void;
  onAction: (action: CleanupAction) => void;
  onUpgrade: () => void;
}) {
  const { t } = useLocale();
  const isZh = t("ws.modBarber") === "资产理发师";
  const showSol = scope !== "bnb";
  const showBnb = scope !== "sol";

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="inline-flex rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-3 py-1 text-xs font-semibold text-[#fde68a]">
          {isZh ? "演示模式 · 不读取真实钱包、不执行清理" : "Demo mode · no live wallet reads or cleanup"}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-3xl text-[#c0c1ff]">✂</span>
          <h1 className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl">
            {t("ws.modBarber")}
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-[#c7c4d7]">
          {isZh
            ? "深度清理钱包：识别粉尘资产、垃圾 Token 与高危合约，帮助你维持更安全、更清晰的资产视图。"
            : "Deep clean your wallet. We identify dust assets, spam tokens, and risky smart contracts to help you maintain a secure and organized portfolio."}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-12">
        <article className="relative flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-[#262932] bg-[#16181D] p-6 shadow-lg shadow-black/20 md:col-span-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-[#c7c4d7]">Wallet Cleanliness Score</p>
          <div className="relative flex size-32 items-center justify-center">
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#34343d" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F59E0B" strokeDasharray="282.7" strokeDashoffset={62.19} strokeLinecap="round" strokeWidth="8" />
            </svg>
            <div className="relative z-10 text-center">
              <span className="block text-4xl font-bold text-[#F59E0B]">{profileScore(report.cleanliness)}</span>
              <span className="text-xs font-semibold text-[#c7c4d7]">/ 100</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold text-[#F59E0B]">{report.cleanliness >= 90 ? "Clean" : "Needs Attention"}</p>
        </article>

        <div className="grid grid-cols-2 gap-4 md:col-span-8 lg:grid-cols-4">
          {report.metrics.slice(0, 4).map((metric, index) => (
            <article key={metric.label} className="flex min-h-[150px] flex-col justify-between rounded-xl border border-[#262932] bg-[#16181D] p-5 transition hover:border-[#908fa0]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl" style={{ color: metric.tone }}>{["⚠", "♻", "⌫", "▧"][index]}</span>
                <span className="rounded bg-white/5 px-2 py-1 text-xs font-semibold" style={{ color: metric.tone }}>
                  DEMO
                </span>
              </div>
              <div className="mt-4">
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.05em] text-[#c7c4d7]">{metric.label}</h2>
                <p className="text-2xl font-semibold text-[#F9FAFB]">{metric.value}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-xl border border-[#c0c1ff]/20 bg-[#1b1b23] p-6">
        <div className="relative z-10 flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#8083ff] text-xl text-[#0d0096]">▣</span>
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-[#e1e0ff]">AI Cleanup Strategy Recommended</h2>
            <p className="max-w-4xl leading-7 text-[#c7c4d7]">
              {report.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={onScan} className="flex min-h-12 items-center gap-2 rounded-lg bg-[#c0c1ff] px-6 text-sm font-semibold text-[#1000a9] shadow-lg shadow-[#c0c1ff]/20 transition hover:opacity-90">
                <span>⌖</span>
                {isZh ? "扫描我的钱包" : "Scan my wallet"}
              </button>
              <button type="button" onClick={onUpgrade} className="min-h-12 rounded-lg border border-[#464554] px-5 text-sm font-semibold text-[#c7c4d7] transition hover:border-[#c0c1ff]">
                {isZh ? "Pro 预览" : "Pro preview"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Classification onAction={onAction} />

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-xl border border-[#262932] bg-[#16181D] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262932] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#c0c1ff]">Mock chain details</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#F9FAFB]">
                {isZh ? "SOL + BNB 细分结果" : "SOL + BNB breakdown"}
              </h2>
            </div>
            <ScopeTabs scope={scope} onScope={onScope} />
          </div>
          <div className="mt-4 space-y-4">
            {showSol && <SolanaPanel report={report} onAction={onAction} />}
            {showBnb && <BnbPanel report={report} onAction={onAction} />}
          </div>
        </article>
        <article className="rounded-xl border border-[#262932] bg-[#16181D] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#c0c1ff]">AI risk explanation</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#F9FAFB]">
            {isZh ? "先处理授权，别为粉尘多付成本" : "Fix approvals first — don’t overpay for dust"}
          </h2>
          <p className="mt-4 leading-7 text-[#c7c4d7]">
            {report.summary}{" "}
            {isZh
              ? "我们不建议因“看起来可回收”就点击陌生链接、Swap 粉尘或授权新合约。清理前应该确认资产来源、协议用途和成本。"
              : "Don’t click unknown links, swap dust, or approve new contracts just because value looks recoverable. Confirm source, protocol purpose, and cost first."}
          </p>
          <div className="mt-5 space-y-3">
            {report.actions.length ? report.actions.map((action) => (
              <button type="button" onClick={() => onAction(action)} key={action.id} className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#34343d] bg-[#1f1f27] p-4 text-left transition hover:border-[#8083ff]">
                <span>
                  <strong className="block text-[#F9FAFB]">{action.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-[#9CA3AF]">{action.detail}</span>
                </span>
                <span className={action.tone === "danger" ? "shrink-0 text-sm font-semibold text-[#EF4444]" : action.tone === "warning" ? "shrink-0 text-sm font-semibold text-[#F59E0B]" : "shrink-0 text-sm font-semibold text-[#10B981]"}>
                  {action.recommendation} →
                </span>
              </button>
            )) : (
              <div className="rounded-lg border border-dashed border-[#464554] p-5 text-[#9CA3AF]">
                {isZh
                  ? "没有推荐清理动作。空结果不等于绝对安全，仍建议定期复查。"
                  : "No cleanup actions recommended. Empty ≠ safe — re-check periodically."}
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function Classification({ onAction }: { onAction: (action: CleanupAction) => void }) {
  const { t } = useLocale();
  const isZh = t("ws.modBarber") === "资产理发师";
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 border-b border-[#262932] pb-2 text-2xl font-semibold text-[#F9FAFB]">
        <span>⌘</span>
        Asset Classification
      </h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="flex flex-col overflow-hidden rounded-xl border border-[#262932] bg-[#16181D]">
          <CategoryHeader
            icon="♻"
            title={isZh ? "可回收资产 (Recoverable)" : "Recoverable"}
            count="3 Items"
            tone="#c0c1ff"
          />
          <div className="grow space-y-3 p-4">
            {recoverable.map((item) => (
              <div key={item.symbol} className="flex items-center justify-between rounded-lg bg-[#1f1f27] p-3 transition hover:outline hover:outline-1 hover:outline-[#c0c1ff]/30">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#34343d] text-xs font-bold text-[#c7c4d7]">{item.symbol}</span>
                  <span>
                    <strong className="block text-xs font-semibold text-[#F9FAFB]">{item.name}</strong>
                    <span className="font-mono text-xs text-[#c7c4d7]">{item.amount}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#10B981]">{item.value}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onAction({
                        id: item.symbol,
                        title: `Recycle ${item.name}`,
                        detail: isZh
                          ? "演示版不会执行归集、Swap 或 CloseAccount。"
                          : "Demo never runs sweep, swap, or CloseAccount.",
                        recommendation: isZh ? "需要确认" : "Confirm needed",
                        tone: "warning",
                      })
                    }
                    className="mt-1 text-xs font-semibold text-[#c0c1ff] hover:underline"
                  >
                    Recycle
                  </button>
                </div>
              </div>
            ))}
          </div>
          <CategoryFooter
            label="View All Recoverable"
            tone="#c0c1ff"
            onClick={() =>
              onAction({
                id: "all-recoverable",
                title: isZh ? "查看全部可回收资产" : "View all recoverable assets",
                detail: isZh
                  ? "仅展示 Mock 估算，不执行真实链上交易。"
                  : "Mock estimates only — no real on-chain txs.",
                recommendation: isZh ? "需要确认" : "Confirm needed",
                tone: "warning",
              })
            }
          />
        </article>

        <article className="flex flex-col overflow-hidden rounded-xl border border-[#262932] bg-[#16181D]">
          <CategoryHeader
            icon="◌"
            title={isZh ? "建议隐藏资产 (Suggested Hide)" : "Suggested hide"}
            count="173 Items"
            tone="#F59E0B"
          />
          <div className="grow space-y-3 p-4">
            {hiddenAssets.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg bg-[#1f1f27] p-3 transition hover:outline hover:outline-1 hover:outline-[#F59E0B]/30">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#34343d] text-sm text-[#F59E0B]">{item.icon}</span>
                  <span>
                    <strong className="block max-w-28 truncate text-xs font-semibold text-[#F9FAFB]" title={item.name}>{item.name}</strong>
                    <span className="font-mono text-xs text-[#c7c4d7]">{item.type}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onAction({
                      id: item.name,
                      title: `Hide ${item.name}`,
                      detail: isZh
                        ? "隐藏只是本地展示层动作，不访问代币链接或合约。"
                        : "Hide is a local display action — no token links or contracts.",
                      recommendation: isZh ? "建议处理" : "Review",
                      tone: "warning",
                    })
                  }
                  className="rounded border border-[#262932] bg-[#16181D] px-3 py-1 text-xs font-semibold text-[#F59E0B] transition hover:bg-[#34343d]"
                >
                  Hide
                </button>
              </div>
            ))}
          </div>
          <CategoryFooter
            label="Hide All Spam"
            tone="#F59E0B"
            onClick={() =>
              onAction({
                id: "hide-spam",
                title: "Hide All Spam",
                detail: isZh
                  ? "批量隐藏为 Mock 动作，不会签名或提交交易。"
                  : "Bulk hide is a mock action — no signatures or broadcasts.",
                recommendation: isZh ? "建议处理" : "Review",
                tone: "warning",
              })
            }
          />
        </article>

        <article className="relative flex flex-col overflow-hidden rounded-xl border border-[#EF4444]/30 bg-[#16181D]">
          <CategoryHeader
            icon="✖"
            title={isZh ? "禁止处理资产 (Do Not Touch)" : "Do not touch"}
            count="2 Items"
            tone="#EF4444"
            danger
          />
          <div className="grow space-y-3 p-4">
            {blockedAssets.map((item) => (
              <div key={item.name} className="relative overflow-hidden rounded-lg border border-[#EF4444]/20 bg-[#1f1f27] p-3">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: item.tone }}>{item.icon}</span>
                    <strong className="text-xs font-semibold text-[#F9FAFB]">{item.name}</strong>
                  </div>
                  <span className="rounded bg-[#EF4444]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#EF4444]">{item.tag}</span>
                </div>
                <p className="truncate font-mono text-xs text-[#c7c4d7]">{item.address}</p>
                <p className="mt-2 text-xs leading-tight text-[#c7c4d7]">{item.copy}</p>
              </div>
            ))}
          </div>
          <CategoryFooter
            label="Why can't I touch these?"
            tone="#EF4444"
            onClick={() =>
              onAction({
                id: "do-not-touch",
                title: "Why can't I touch these?",
                detail: isZh
                  ? "这些资产可能含恶意转账逻辑，最安全的动作通常是不交互。"
                  : "These assets may contain malicious transfer logic — safest action is usually no interaction.",
                recommendation: isZh ? "保留" : "Keep",
                tone: "danger",
              })
            }
          />
        </article>
      </div>
    </section>
  );
}

function CategoryHeader({ icon, title, count, tone, danger = false }: { icon: string; title: string; count: string; tone: string; danger?: boolean }) {
  return (
    <div className={danger ? "flex items-center justify-between border-b border-[#EF4444]/20 bg-[#93000a]/20 p-4" : "flex items-center justify-between border-b border-[#262932] bg-[#393841] p-4"}>
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.05em]" style={{ color: tone }}>
        <span>{icon}</span>
        {title}
      </h3>
      <span className="rounded border border-current/20 bg-[#16181D] px-2 py-0.5 text-xs font-semibold" style={{ color: danger ? tone : "#c7c4d7" }}>{count}</span>
    </div>
  );
}

function CategoryFooter({ label, tone, onClick }: { label: string; tone: string; onClick: () => void }) {
  return (
    <div className="border-t border-[#262932] bg-[#1b1b23] p-4 text-center">
      <button type="button" onClick={onClick} className="text-xs font-semibold transition hover:opacity-80" style={{ color: tone }}>
        {label}
      </button>
    </div>
  );
}

function ScopeTabs({ scope, onScope }: { scope: ChainScope; onScope: (scope: ChainScope) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["all", "sol", "bnb"] as ChainScope[]).map((item) => (
        <button key={item} type="button" onClick={() => onScope(item)} className={scope === item ? "rounded-lg bg-[#8083ff] px-4 py-2 text-sm font-semibold text-[#1000a9]" : "rounded-lg border border-[#464554] px-4 py-2 text-sm text-[#c7c4d7]"}>
          {item === "all" ? "SOL + BNB" : item === "sol" ? "Solana" : "BNB / BSC"}
        </button>
      ))}
    </div>
  );
}

function Setup({
  address,
  scope,
  connected,
  profile,
  error,
  onAddress,
  onScope,
  onConnect,
  onProfile,
  onScan,
  onBack,
}: {
  address: string;
  scope: ChainScope;
  connected: boolean;
  profile: ScanProfile;
  error: string;
  onAddress: (value: string) => void;
  onScope: (value: ChainScope) => void;
  onConnect: () => void;
  onProfile: (value: ScanProfile) => void;
  onScan: () => void;
  onBack: () => void;
}) {
  const { t } = useLocale();
  const profileLabels: Record<ScanProfile, string> = {
    risk: t("barber.profileRisk"),
    clean: t("barber.profileClean"),
    empty: t("barber.profileEmpty"),
    failed: t("barber.profileFailed"),
  };
  const isZh = t("ws.modBarber") === "资产理发师";

  return (
    <section className="mx-auto max-w-[780px] space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-[#c0c1ff]">
        ← Back to dashboard
      </button>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-[#c0c1ff]">✂</span>
          <h1 className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-4xl font-bold text-transparent">
            {t("ws.modBarber")}
          </h1>
        </div>
        <p className="text-lg leading-8 text-[#c7c4d7]">
          {isZh
            ? "选择扫描范围后运行只读 mock 体检。不会请求真实钱包签名或交易。"
            : "Choose scan scope and run the read-only mock audit. No wallet signature or transaction will be requested."}
        </p>
      </div>

      <article className="rounded-xl border border-[#262932] bg-[#16181D] p-6 shadow-lg shadow-black/20">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#8083ff] text-[#0d0096]">
            ⌖
          </span>
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#c0c1ff]">
              Read-only demo setup
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#F9FAFB]">
              {isZh ? "连接或输入演示地址" : "Connect or paste a demo address"}
            </h2>
            <p className="mt-2 leading-7 text-[#c7c4d7]">
              {isZh
                ? "选择扫描范围后，使用本地 Mock 数据生成完整报告。不会弹出真实钱包签名。"
                : "After choosing scope, local mock data builds the full report. No real wallet signature."}
            </p>
            <div className="mt-5">
              <ScopeTabs scope={scope} onScope={onScope} />
            </div>
            <label className="mt-6 block text-sm font-semibold text-[#e4e1ed]">
              {isZh ? "钱包地址" : "Wallet address"}
            </label>
            <input
              value={address}
              onChange={(event) => onAddress(event.target.value)}
              placeholder={isZh ? "输入 SOL 或 BNB 演示地址" : "Paste SOL or BNB demo address"}
              className="mt-2 min-h-12 w-full rounded-lg border border-[#464554] bg-[#0d0d15] px-4 text-[#F9FAFB] outline-none placeholder:text-[#6B7280] focus:border-[#c0c1ff]"
              aria-invalid={Boolean(error)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {(["risk", "clean", "empty", "failed"] as ScanProfile[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onProfile(item)}
                  className={
                    profile === item
                      ? "rounded-full border border-[#c0c1ff] bg-[#8083ff]/20 px-3 py-1.5 text-xs font-semibold text-[#e1e0ff]"
                      : "rounded-full border border-[#464554] px-3 py-1.5 text-xs text-[#c7c4d7]"
                  }
                >
                  {isZh ? "演示：" : "Demo: "}
                  {profileLabels[item]}
                </button>
              ))}
            </div>
            {error && (
              <p role="alert" className="mt-3 text-sm text-[#ffb4ab]">
                {error}
              </p>
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onConnect}
                className="min-h-12 rounded-lg border border-[#464554] px-5 font-semibold text-[#e4e1ed] transition hover:border-[#c0c1ff]"
              >
                {connected
                  ? isZh
                    ? "Mock 钱包已连接"
                    : "Mock wallet connected"
                  : isZh
                    ? "Mock 连接钱包"
                    : "Mock connect wallet"}
              </button>
              <button
                type="button"
                onClick={onScan}
                className="min-h-12 rounded-lg bg-[#c0c1ff] px-5 font-semibold text-[#1000a9] shadow-lg shadow-[#c0c1ff]/20 transition hover:opacity-90"
              >
                {isZh ? "开始只读扫描 →" : "Start read-only scan →"}
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

function Scanning({
  step,
  address,
  scope,
  steps,
}: {
  step: number;
  address: string;
  scope: ChainScope;
  steps: string[];
}) {
  const { t } = useLocale();
  const isZh = t("ws.modBarber") === "资产理发师";
  return (
    <section className="mx-auto max-w-[780px] space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-[#c0c1ff]">⌖</span>
          <h1 className="bg-gradient-to-r from-[#c0c1ff] to-[#ddb7ff] bg-clip-text text-4xl font-bold text-transparent">
            {isZh ? "CA 安检中" : "Scanning…"}
          </h1>
        </div>
        <p className="break-all text-lg leading-8 text-[#c7c4d7]">{address} · {scope === "all" ? "SOL + BNB" : scope === "sol" ? "Solana" : "BNB / BSC"}</p>
      </div>
      <article className="rounded-xl border border-[#262932] bg-[#16181D] p-6 shadow-lg shadow-black/20">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 animate-pulse items-center justify-center rounded-lg bg-[#8083ff] text-[#0d0096]">▣</span>
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#c0c1ff]">AI wallet audit</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#F9FAFB]">
              {isZh ? "正在生成清理报告" : "Building cleanup report"}
            </h2>
            <ol className="mt-6 space-y-3">
              {steps.map((item, index) => (
                <li key={item} className="flex items-center gap-3 rounded-lg border border-[#262932] bg-[#1f1f27] px-4 py-4">
                  <span className={index < step ? "flex size-6 items-center justify-center rounded-full bg-[#10B981] text-xs font-bold text-[#07110d]" : index === step ? "flex size-6 animate-pulse items-center justify-center rounded-full bg-[#8083ff] text-xs font-bold text-[#1000a9]" : "flex size-6 items-center justify-center rounded-full bg-[#34343d] text-xs text-[#c7c4d7]"}>
                    {index < step ? "✓" : index + 1}
                  </span>
                  <span className={index <= step ? "text-[#F9FAFB]" : "text-[#9CA3AF]"}>{item}</span>
                  <span className="ml-auto text-xs text-[#9CA3AF]">
                    {index < step
                      ? t("scan.stepDone")
                      : index === step
                        ? t("scan.stepRun")
                        : t("scan.stepWait")}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#34343d]">
              <div className="h-full rounded-full bg-[#c0c1ff] transition-all duration-500" style={{ width: `${Math.max(8, (step / steps.length) * 100)}%` }} />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

function Failed({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  const { t } = useLocale();
  const isZh = t("ws.modBarber") === "资产理发师";
  return (
    <section className="mx-auto max-w-[780px] rounded-xl border border-[#EF4444]/35 bg-[#16181D] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#ffb4ab]">Scan failed · mock state</p>
      <h1 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">
        {isZh ? "本次扫描未完成" : "This scan did not finish"}
      </h1>
      <p className="mt-4 leading-7 text-[#c7c4d7]">
        {isZh
          ? "演示地址模拟了 RPC 超时。真实版本会提供重试、网络状态和可复查的错误编号；不会因为失败而发起任何链上请求。"
          : "This demo address simulates an RPC timeout. Production will surface retry, network status, and reviewable error IDs — never on-chain actions on failure."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRetry} className="min-h-12 rounded-lg bg-[#ffb4ab] px-6 font-semibold text-[#690005]">
          {isZh ? "返回并重新扫描" : "Back and rescan"}
        </button>
        <button type="button" onClick={onBack} className="min-h-12 rounded-lg border border-[#464554] px-6 font-semibold text-[#e4e1ed]">
          {isZh ? "回到仪表盘" : "Back to dashboard"}
        </button>
      </div>
    </section>
  );
}

function SolanaPanel({ report, onAction }: { report: ReturnType<typeof reportFor>; onAction: (action: CleanupAction) => void }) {
  const { t } = useLocale();
  const isZh = t("ws.modBarber") === "资产理发师";
  return (
    <div className="rounded-lg border border-[#262932] bg-[#1f1f27] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-[#c0c1ff]">◎ SOLANA</h3>
        <span className="rounded border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-2 py-1 text-xs text-[#F59E0B]">
          {isZh ? "仅 Mock" : "Mock only"}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {(
          [
            [isZh ? "空 Token Account" : "Empty token accounts", report.sol.emptyAccounts],
            [isZh ? "预计可回收" : "Est. recoverable", report.sol.recoverableSol],
            [isZh ? "垃圾 / Spam NFT" : "Spam NFTs", report.sol.spamNfts],
          ] as const
        ).map(([label, value]) => (
          <div key={String(label)} className="rounded-lg bg-[#16181D] p-3">
            <p className="text-xs text-[#9CA3AF]">{label}</p>
            <p className="mt-1 font-semibold text-[#F9FAFB]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {report.sol.dust.length ? report.sol.dust.map((item) => (
          <div key={item.name} className="grid gap-2 rounded-lg border border-[#34343d] bg-[#16181D] p-3 text-sm sm:grid-cols-[1fr_.8fr_1fr_1fr]">
            <strong className="text-[#F9FAFB]">{item.name}</strong>
            <span className="text-[#c7c4d7]">{item.amount}</span>
            <span className="text-[#F59E0B]">{item.risk}</span>
            <span className="text-[#c7c4d7]">{item.action}</span>
          </div>
        )) : (
          <div className="rounded-lg border border-dashed border-[#464554] p-4 text-[#9CA3AF]">
            {isZh ? "没有发现 SOL 粉尘资产或垃圾 NFT。" : "No SOL dust or spam NFTs found."}
          </div>
        )}
      </div>
      {report.sol.emptyAccounts > 0 && (
        <button
          type="button"
          onClick={() =>
            onAction({
              id: "sol-close",
              title: isZh ? "查看空账户清理模拟" : "Preview empty-account cleanup",
              detail: isZh ? "不会执行真实 CloseAccount。" : "Will not execute a real CloseAccount.",
              recommendation: isZh ? "需要确认" : "Confirm needed",
              tone: "warning",
            })
          }
          className="mt-4 rounded-lg border border-[#8083ff] px-4 py-2 text-sm font-semibold text-[#c0c1ff]"
        >
          {isZh ? "查看可回收 SOL 模拟" : "Preview recoverable SOL"}
        </button>
      )}
    </div>
  );
}

function BnbPanel({ report, onAction }: { report: ReturnType<typeof reportFor>; onAction: (action: CleanupAction) => void }) {
  const { t } = useLocale();
  const isZh = t("ws.modBarber") === "资产理发师";
  return (
    <div className="rounded-lg border border-[#262932] bg-[#1f1f27] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-[#ffb783]">◆ BNB SMART CHAIN</h3>
        <span className="rounded border border-[#EF4444]/35 bg-[#EF4444]/10 px-2 py-1 text-xs text-[#ffb4ab]">
          {isZh ? "仅 Mock" : "Mock only"}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {report.bnb.length ? report.bnb.map((item) => (
          <div key={item.spender} className="rounded-lg border border-[#34343d] bg-[#16181D] p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <strong className="font-mono text-[#F9FAFB]">{item.spender}</strong>
              <span className={item.risk === "High" ? "rounded bg-[#EF4444]/15 px-2 py-1 text-xs font-semibold text-[#ffb4ab]" : item.risk === "Medium" ? "rounded bg-[#F59E0B]/15 px-2 py-1 text-xs font-semibold text-[#F59E0B]" : "rounded bg-[#10B981]/15 px-2 py-1 text-xs font-semibold text-[#10B981]"}>
                {item.risk}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[#c7c4d7] sm:grid-cols-4">
              <span>
                {isZh ? "额度：" : "Allowance: "}
                {item.allowance}
              </span>
              <span>
                {item.infinite
                  ? isZh
                    ? "∞ 无限授权"
                    : "∞ unlimited"
                  : isZh
                    ? "有限额度"
                    : "Limited"}
              </span>
              <span>
                {isZh ? "最近使用：" : "Last used: "}
                {item.lastUsed}
              </span>
              <span>{item.advice}</span>
            </div>
            {item.risk !== "Low" && (
              <button
                type="button"
                onClick={() =>
                  onAction({
                    id: item.spender,
                    title: isZh ? `复查授权 ${item.spender}` : `Review approval ${item.spender}`,
                    detail: item.advice,
                    recommendation: isZh ? "需要确认" : "Confirm needed",
                    tone: "danger",
                  })
                }
                className="mt-3 rounded border border-[#EF4444]/45 px-3 py-2 text-sm font-semibold text-[#ffb4ab]"
              >
                {isZh ? "模拟撤销前检查" : "Pre-revoke check (demo)"}
              </button>
            )}
          </div>
        )) : (
          <div className="rounded-lg border border-dashed border-[#464554] p-4 text-[#9CA3AF]">
            {isZh ? "没有发现 BNB/BSC 授权记录。" : "No BNB/BSC approvals found."}
          </div>
        )}
      </div>
    </div>
  );
}

function SafetyModal({ type, action, onClose }: { type: Modal; action: CleanupAction | null; onClose: () => void }) {
  const { t } = useLocale();
  const isZh = t("ws.modBarber") === "资产理发师";
  const isUpgrade = type === "upgrade";
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="asset-barber-modal-title" className="fixed inset-0 z-50 flex items-end bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-xl border border-[#464554] bg-[#16181D] p-6 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#c0c1ff]">
          {isUpgrade ? "Pro preview" : "Safety confirmation"}
        </p>
        <h2 id="asset-barber-modal-title" className="mt-2 text-2xl font-semibold text-[#F9FAFB]">
          {isUpgrade ? (isZh ? "Pro 功能仅为演示" : "Pro features are demo-only") : action?.title}
        </h2>
        <p className="mt-4 leading-7 text-[#c7c4d7]">
          {isUpgrade
            ? isZh
              ? "当前不接支付。这里仅展示能力差异，未创建订单、订阅或任何费用。"
              : "No payments yet. This only shows capability differences — no order, subscription, or charge."
            : isZh
              ? "当前版本是演示 / Mock：不会执行 CloseAccount、Burn NFT、Revoke、归集、Swap、Bridge 或转账。未来真实执行前，会逐笔展示交易明细、Gas 估算，并要求你在自己的钱包中确认签名。"
              : "Demo / mock only: no CloseAccount, burn, revoke, sweep, swap, bridge, or transfer. Live execution will show tx details, gas estimates, and require your in-wallet signature."}
        </p>
        {!isUpgrade && (
          <p className="mt-4 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-3 text-sm text-[#ffdcc5]">
            {isZh ? "建议：" : "Note: "}
            {action?.detail}
          </p>
        )}
        <button type="button" onClick={onClose} className="mt-6 min-h-12 w-full rounded-lg bg-[#c0c1ff] font-semibold text-[#1000a9]">
          {isZh ? "我知道了" : "Got it"}
        </button>
      </div>
    </div>
  );
}

function profileScore(score: number) {
  if (score >= 90) return score;
  return 78;
}
