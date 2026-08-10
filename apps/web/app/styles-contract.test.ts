import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const webRoot = resolve(import.meta.dirname, "..");

describe("Web style build contract", () => {
  it("keeps Tailwind import and PostCSS compiler configured together", () => {
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");
    const postcss = readFileSync(
      resolve(webRoot, "postcss.config.mjs"),
      "utf8",
    );

    expect(globals).toContain('@import "tailwindcss"');
    expect(postcss).toContain("@tailwindcss/postcss");
  });

  it("keeps keyboard focus visible across the dark UI", () => {
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");
    const layout = readFileSync(resolve(webRoot, "app/layout.tsx"), "utf8");

    expect(globals).toContain(
      ":where(a, button, input, summary):focus-visible",
    );
    expect(globals).toMatch(
      /outline:\s*2px solid (var\(--cv-primary\)|#c0c1ff)/,
    );
    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('id="main-content"');
    expect(globals).toContain("prefers-reduced-motion: reduce");
  });

  it("does not present static V0 examples as a live scan", () => {
    const home = readFileSync(resolve(webRoot, "app/page.tsx"), "utf8");
    const messages = readFileSync(
      resolve(webRoot, "app/i18n/messages.ts"),
      "utf8",
    );
    const fakeTokenDatabase = readFileSync(
      resolve(webRoot, "app/fake-token-database/page.tsx"),
      "utf8",
    );

    expect(home).toContain("home.alertMock");
    expect(messages).toContain("V0 MOCK");
    expect(home.toUpperCase()).not.toContain("LIVE SCAN");
    expect(fakeTokenDatabase).toMatch(/V0 mock/i);
    expect(fakeTokenDatabase).not.toContain("Token 名称或 Symbol 开始核验");
  });

  it("wires bilingual shell on layout and header", () => {
    const layout = readFileSync(resolve(webRoot, "app/layout.tsx"), "utf8");
    const header = readFileSync(
      resolve(webRoot, "app/ui/site-header.tsx"),
      "utf8",
    );
    expect(layout).toContain("LocaleProvider");
    expect(header).toContain("LanguageSwitcher");
  });

  it("keeps Stitch design tokens in globals", () => {
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");
    expect(globals).toContain("--cv-primary-container");
    expect(globals).toContain("ai-gradient-text");
    expect(globals).toContain("cv-scan-line");
    expect(globals).toContain("cv-score-ring-transition");
    for (const token of [
      "--cv-dapp-bg",
      "--cv-dapp-cyan",
      "--cv-dapp-lime",
      "--cv-dapp-surface-container",
    ]) {
      expect(globals).toContain(token);
    }
    expect(globals).toContain("cv-dapp-page");
    expect(globals).toContain("cv-vigil-core");
  });

  it("keeps the Consumer DApp routes on the shared Stitch shell", () => {
    const header = readFileSync(
      resolve(webRoot, "app/ui/dapp-header.tsx"),
      "utf8",
    );
    const check = readFileSync(
      resolve(webRoot, "app/check/check-page-client.tsx"),
      "utf8",
    );
    const token = readFileSync(
      resolve(webRoot, "app/token/[chain]/[address]/page.tsx"),
      "utf8",
    );
    const wallet = readFileSync(
      resolve(webRoot, "app/wallet-check/page.tsx"),
      "utf8",
    );
    const health = readFileSync(
      resolve(webRoot, "app/wallet/[address]/health/page.tsx"),
      "utf8",
    );
    const approvals = readFileSync(
      resolve(webRoot, "app/app/approvals/approvals-client.tsx"),
      "utf8",
    );
    const approvalsRoute = readFileSync(
      resolve(webRoot, "app/approvals/page.tsx"),
      "utf8",
    );

    expect(header).toContain("MOCK / READINESS");
    expect(header).toContain("DappIcon");
    for (const route of [check, token, wallet, health, approvals]) {
      expect(route).toContain("cv-dapp-page");
      expect(route).toContain("DappHeader");
      expect(route).toContain("ConsumerMobileNav");
    }
    expect(token).toContain("EVIDENCE FIRST");
    expect(approvals).not.toContain("RevokeConfirmModal");
    expect(header).toContain('href: "/approvals"');
    expect(approvalsRoute).toContain("ApprovalsClient");
    expect(approvalsRoute).toContain("index: false");
    expect(approvalsRoute).toContain('state === "empty"');
  });

  it("keeps Website home and chain guides on the dedicated Stitch shell", () => {
    const home = readFileSync(resolve(webRoot, "app/page.tsx"), "utf8");
    const chain = readFileSync(
      resolve(webRoot, "app/ui/chain-topic-page.tsx"),
      "utf8",
    );
    const header = readFileSync(
      resolve(webRoot, "app/ui/website-header.tsx"),
      "utf8",
    );
    const footer = readFileSync(
      resolve(webRoot, "app/ui/website-footer.tsx"),
      "utf8",
    );
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");

    expect(home).toContain("WebsiteHeader");
    expect(home).toContain("WebsiteFooter");
    expect(home).toContain('variant="website"');
    expect(home).not.toContain("<MobileNav");
    expect(chain).toContain("WebsiteHeader");
    expect(chain).toContain("WebsiteFooter");
    expect(chain).not.toContain("REVOKE ACCESS");
    expect(chain).not.toContain("Revoke Access");
    expect(header).toContain("Enter Web DApp");
    expect(footer).toContain("Mock/Readiness");
    expect(globals).toContain("cv-website-page");
    expect(globals).toContain("cv-website-panel");
  });

  it("keeps intelligence, Learn, and Trust content on the public Website shell", () => {
    const intelligenceRoutes = [
      "app/intel/page.tsx",
      "app/risk-database/page.tsx",
      "app/leaderboard/high-risk-tokens/page.tsx",
      "app/fake-token-database/page.tsx",
      "app/learn/page.tsx",
      "app/learn/[slug]/page.tsx",
    ].map((file) => readFileSync(resolve(webRoot, file), "utf8"));
    const trust = readFileSync(
      resolve(webRoot, "app/(trust)/[trust]/page.tsx"),
      "utf8",
    );
    const subnav = readFileSync(
      resolve(webRoot, "app/ui/intelligence-subnav.tsx"),
      "utf8",
    );
    const globalTrustFooter = readFileSync(
      resolve(webRoot, "app/ui/trust-footer.tsx"),
      "utf8",
    );

    for (const route of intelligenceRoutes) {
      expect(route).toContain("cv-website-page");
      expect(route).toContain("WebsiteHeader");
      expect(route).toContain("WebsiteFooter");
      expect(route).toContain("IntelligenceSubnav");
      expect(route).not.toContain("<MobileNav");
      expect(route).not.toContain("<SiteHeader");
    }
    expect(subnav).toContain("Risk intelligence navigation");
    expect(trust).toContain('"risk-disclosure"');
    expect(trust).toContain("WebsiteHeader");
    expect(trust).toContain("WebsiteFooter");
    expect(trust).not.toContain("live data states");
    expect(intelligenceRoutes[2]).not.toContain('t("common.score")');
    expect(globalTrustFooter).toContain('normalizedPath.startsWith("/learn/")');
    expect(globalTrustFooter).toContain('"/risk-disclosure"');
  });

  it("keeps Pricing, Developers, API, and Bot on a truthful global-ready shell", () => {
    const routes = [
      "app/pricing/page.tsx",
      "app/developers/page.tsx",
      "app/api/page.tsx",
      "app/bot/page.tsx",
    ].map((file) => readFileSync(resolve(webRoot, file), "utf8"));
    const subnav = readFileSync(
      resolve(webRoot, "app/ui/developer-subnav.tsx"),
      "utf8",
    );

    for (const route of routes) {
      expect(route).toContain("cv-website-page");
      expect(route).toContain("WebsiteHeader");
      expect(route).toContain("WebsiteFooter");
      expect(route).toContain("DeveloperSubnav");
      expect(route).not.toContain("<MobileNav");
      expect(route).not.toContain("<SiteHeader");
    }
    expect(routes[0]).toContain("NO CHECKOUT");
    expect(routes[0]).not.toContain('price: "¥19–49/mo"');
    expect(routes[1]).toContain("CHAINVIGIL_API_URL");
    expect(routes[1]).not.toContain('baseUrl: "http://localhost:4000"');
    expect(routes[2]).toContain("NEXT_PUBLIC_API_BASE_URL");
    expect(routes[2]).not.toContain(
      'href="http://localhost:4000/openapi.json"',
    );
    expect(subnav).toContain("Developer and pricing navigation");
  });

  it("keeps Workspace routes on the four-tab mobile shell", () => {
    const header = readFileSync(
      resolve(webRoot, "app/ui/workspace-header.tsx"),
      "utf8",
    );
    const nav = readFileSync(
      resolve(webRoot, "app/ui/workspace-mobile-nav.tsx"),
      "utf8",
    );
    const routes = [
      "app/app/page.tsx",
      "app/app/wallets/page.tsx",
      "app/app/reports/page.tsx",
      "app/app/monitor/page.tsx",
      "app/app/points/page.tsx",
      "app/app/growth/growth-client.tsx",
      "app/app/settings/page.tsx",
      "app/app/dust/page.tsx",
      "app/app/approvals/page.tsx",
      "app/app/approval-cleaner/page.tsx",
      "app/app/asset-barber/asset-barber-client.tsx",
    ].map((file) => readFileSync(resolve(webRoot, file), "utf8"));

    expect(header).toContain("Workspace modules");
    expect(header).not.toContain("ChainVigil AI");
    expect(nav).toContain("grid-cols-4");
    for (const id of ["overview", "wallets", "reports", "points"]) {
      expect(nav).toContain(`id: "${id}"`);
    }
    for (const route of routes) {
      expect(route).toContain("cv-workspace-page");
      expect(route).toContain("WorkspaceHeader");
      expect(route).toContain("WorkspaceMobileNav");
      expect(route).not.toContain("<MobileNav");
    }
    const dashboard = routes[0];
    const reports = routes[2];
    expect(dashboard).toContain("No fabricated queue");
    expect(dashboard).toContain("ProviderCoverage");
    expect(reports).not.toContain("report.score");
    expect(routes[8]).not.toContain("report.summary.score");
    expect(routes[8]).toContain("report.approvals.length > 0");
    expect(routes[8]).toContain(
      "No approval evidence for this watched address",
    );
    expect(routes[8]).toContain('state === "empty"');
    expect(header).toContain('"/app/approvals"');
  });

  it("wires wallet progressive scan, read-only report boundaries, and revoke safety guidance", () => {
    const walletForm = readFileSync(
      resolve(webRoot, "app/ui/wallet-check-form.tsx"),
      "utf8",
    );
    const walletScan = readFileSync(
      resolve(webRoot, "app/ui/wallet-scan-progress.tsx"),
      "utf8",
    );
    const revoke = readFileSync(
      resolve(webRoot, "app/ui/revoke-confirm-modal.tsx"),
      "utf8",
    );
    const dialogFocus = readFileSync(
      resolve(webRoot, "app/ui/use-dialog-focus.ts"),
      "utf8",
    );
    const health = readFileSync(
      resolve(webRoot, "app/wallet/[address]/health/page.tsx"),
      "utf8",
    );

    expect(walletForm).toContain("WalletScanProgressOverlay");
    expect(walletScan).toContain("walletScan.step.spenders");
    expect(walletScan).not.toContain("Math.random");
    expect(walletScan).not.toContain("progressPct");
    expect(revoke).toContain("revoke.safeOnlyRevoke");
    expect(revoke).toContain("#10b981");
    expect(revoke).toContain("useDialogFocus");
    expect(revoke).toContain('aria-describedby="revoke-description"');
    expect(dialogFocus).toContain('event.key === "Escape"');
    expect(dialogFocus).toContain("previouslyFocused?.focus()");
    expect(dialogFocus).toContain('document.body.style.overflow = "hidden"');
    expect(health).toContain("MOCK / READINESS");
    expect(health).toContain("walletReport.readOnlyStatus");
    expect(health).not.toContain("new Date(report.checkedAt)");
  });

  it("keeps consumer wallet tools read-only and mock monitoring non-realtime", () => {
    const approvals = readFileSync(
      resolve(webRoot, "app/app/approvals/approvals-client.tsx"),
      "utf8",
    );
    const assetBarber = readFileSync(
      resolve(webRoot, "app/app/asset-barber/asset-barber-client.tsx"),
      "utf8",
    );
    const monitor = readFileSync(
      resolve(webRoot, "app/app/monitor/page.tsx"),
      "utf8",
    );

    expect(approvals).not.toContain("RevokeConfirmModal");
    expect(approvals).not.toContain("openRevoke");
    expect(approvals).toContain("approvals.copySpender");
    expect(approvals).not.toContain("report.summary.score");
    expect(approvals).toContain("ProviderCoverage");
    expect(approvals).toContain("report.approvals.length > 0");
    expect(approvals).toContain("No approvals found in current evidence");
    expect(assetBarber).not.toContain("Mock connect wallet");
    expect(assetBarber).not.toContain("Mock 连接钱包");
    expect(assetBarber).toContain("Paste a public demo address");
    expect(assetBarber).toContain('htmlFor="asset-barber-address"');
    expect(assetBarber).toContain('id="asset-barber-address"');
    expect(assetBarber).toContain("useDialogFocus");
    expect(assetBarber).toContain(
      'aria-describedby="asset-barber-modal-description"',
    );
    expect(monitor).toContain("MOCK RULE LIBRARY · READ-ONLY");
    expect(monitor).not.toContain("new Date(monitor.lastSignalAt)");
  });

  it("keeps the consumer mobile shell aligned with the final five-tab and safe-area contract", () => {
    const nav = readFileSync(
      resolve(webRoot, "app/ui/consumer-mobile-nav.tsx"),
      "utf8",
    );
    const actions = readFileSync(
      resolve(webRoot, "app/ui/report-action-bar.tsx"),
      "utf8",
    );
    const share = readFileSync(
      resolve(webRoot, "app/ui/share-report.tsx"),
      "utf8",
    );
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");

    for (const item of ["scan", "reports", "wallet", "monitor", "profile"]) {
      expect(nav).toContain(`id: "${item}"`);
    }
    expect(nav).toContain("grid-cols-5");
    expect(actions).not.toContain("overflow-x-auto");
    expect(actions).toContain("grid-cols-2");
    expect(share).toContain("navigator.share");
    expect(share).toContain("AbortError");
    expect(globals).toContain("env(safe-area-inset-bottom)");
  });

  it("uses one public brand name across bilingual and SEO surfaces", () => {
    const messages = readFileSync(
      resolve(webRoot, "app/i18n/messages.ts"),
      "utf8",
    );
    const seo = readFileSync(resolve(webRoot, "app/lib/seo.ts"), "utf8");

    expect(messages).toContain('"brand.name": "ChainVigil"');
    expect(messages).not.toContain("ChainVigil AI");
    expect(seo).not.toContain("ChainVigil AI");
  });
});
