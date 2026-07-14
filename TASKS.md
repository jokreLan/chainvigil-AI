# UI Completion Loop

This list covers the remaining V0 work that can be completed without external credentials or production infrastructure. Each item follows: implement, run targeted checks, fix up to three times, run the full repository gate, update project logs, commit, push, then proceed.

- [completed] Rebuild the Web App workspace overview (`/app`) with the unified security-intelligence layout.
- [completed] Rebuild the read-only wallet watchlist (`/app/wallets`).
- [completed] Rebuild read-only user preferences (`/app/settings`).
- [completed] Rebuild the public API reference page (`/api`) and V0 pricing/status page (`/pricing`).
- [completed] Standardize remaining public utility pages, empty/loading/error states, mobile layout, CA copy and share feedback.
- [completed] Add Solana/BNB SEO/GEO topic pages, structured data, sitemap and internal links.
- [completed] Expand page-level contracts, API/SDK boundary tests and V0 smoke coverage.
- [in_progress] Repair the residual V0 smoke assertion drift recorded in `BLOCKERS.md`.
- [completed] Apply the UI system to Admin risk review, data sources, audit, Telegram and report-index screens.
- [completed] Standardize the remaining Admin label, VP, readiness and channel screens with the same control-room UI system.
- [blocked] Repair browser screenshot automation and complete desktop/mobile visual regression against Stitch screens. See `BLOCKERS.md`.
- [pending] Run an end-to-end repository release gate and document residual external dependencies.
