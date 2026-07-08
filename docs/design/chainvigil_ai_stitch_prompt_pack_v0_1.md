# ChainVigil AI｜链哨 AI Stitch 页面设计 Prompt Pack v0.1

> 文档类型：Stitch / AI 设计工具 Prompt Pack  
> 产品名称：ChainVigil AI  
> 中文名称：链哨 AI  
> 核心口号：买币前，先查 CA。  
> 积分名称：哨点 / Vigil Points / VP  
> 当前版本：v0.1  
> 日期：2026-07-08

---

## 0. 使用说明

本文件用于喂给 Stitch 或其他 AI UI 设计工具，生成 ChainVigil AI 全产品页面。

使用建议：

1. 每次只生成一个页面或一个页面组。
2. 不要一次性让 Stitch 生成全站，否则容易泛化。
3. 每个 Prompt 都包含页面目标、模块、风格和限制条件。
4. 所有页面都必须遵守：安全感优先、先查后连、不承诺收益、不承诺绝对安全。

统一品牌设定：

```text
Product name: ChainVigil AI
Chinese name: 链哨 AI
Slogan: 买币前，先查 CA。
Points name: Vigil Points / VP
Chinese points name: 哨点
Product positioning: AI-powered Web3 token and wallet risk scanner.
```

统一视觉方向：

```text
Modern dark-mode Web3 security product.
Calm, professional, trustworthy.
Card-based layout.
Blue-purple AI accent.
Risk colors used carefully.
Mobile responsive.
Do not use casino, meme coin, or exaggerated cyberpunk style.
```

统一风险等级：

```text
禁买 / Critical / Red
高危 / High / Orange-red
谨慎 / Medium / Amber
可小额尝试 / Low Trial / Cyan-green
相对低风险 / Low / Green
无法判断 / Unknown / Gray
```

---

# 1. 首页 Landing Page Prompt

```text
Design a modern dark-mode landing page for ChainVigil AI, an AI-powered Web3 token and wallet risk scanner.

Brand:
- Product name: ChainVigil AI
- Chinese name: 链哨 AI
- Slogan: 买币前，先查 CA。
- Primary use case: paste a token contract address or DexScreener/GMGN link to scan honeypot, sell tax, blacklist, LP risk, owner permissions, fake token risk, and dangerous approvals.

Hero section:
- Large title: 买币前，先查 CA。
- Subtitle: AI 检测貔貅盘、高税、黑名单、LP 未锁、Owner 后门、假币与授权风险。
- Main input: Paste token contract address or DEX link
- Primary button: 立即 CA 安检
- Secondary button: 检查我的钱包
- Trust note: 免费检测｜无需连接钱包｜支持主流 EVM 链

Below hero:
- Feature cards: 貔貅检测, 高税检测, 黑名单风险, LP 风险, 假币识别, 授权风险
- Example risk report preview card
- Section explaining wallet health check
- Section introducing Vigil Points / 哨点 VP
- CTA to invite Telegram Bot into group

Style:
- Dark professional Web3 security aesthetic
- Calm, trustworthy, not casino-like
- Use risk colors carefully: red for critical, orange for high, yellow for caution, green for low risk, gray for unknown
- Card-based layout, high readability, mobile responsive

Important restrictions:
- Do not make Connect Wallet the primary CTA
- Do not mention token airdrop or token claim
- Do not imply investment advice
```

---

# 2. CA 安检页 Prompt

```text
Design a CA Scan page for ChainVigil AI.

Page goal:
Allow users to paste a token contract address, pair address, or DexScreener/GMGN link and get an AI-powered token risk analysis.

Page structure:
1. Header with ChainVigil AI logo and navigation
2. Main input card:
   - Title: CA 安检
   - Subtitle: 粘贴合约地址，AI 检测这个币能不能买、买了能不能卖。
   - Input placeholder: 粘贴 Token 合约地址或 DexScreener / GMGN 链接
   - Chain auto-detect indicator
   - Primary button: 立即 CA 安检
   - Note: 无需连接钱包
3. Scan progress state:
   - 识别合约
   - 检测买卖
   - 扫描权限
   - 检查流动性
   - 分析持仓
   - 生成 AI 报告
4. Result preview card after scan:
   - Risk badge
   - AI conclusion
   - Top 3 risk reasons
   - Buttons: 查看完整报告, 分享报告, 检查我的钱包

Visual style:
- Dark mode
- Strong input focus
- AI scanning glow but subtle
- Professional security dashboard look

States to design:
- Empty state
- Loading state
- Error state
- High-risk result
- Unknown result

Restrictions:
- Do not require wallet connection
- Do not say safe to buy
- Use '相对低风险' instead of '安全'
```

---

# 3. Token 风险报告页 Prompt

```text
Design a Token Risk Report page for ChainVigil AI.

Page goal:
Help users quickly understand whether a token is safe to buy, why it is risky, what evidence supports the result, and what action to take next.

Top section:
- Token name, symbol, chain, contract address
- Copy address button
- Risk badge: 禁买 / 高危 / 谨慎 / 可小额尝试 / 相对低风险 / 无法判断
- Checked timestamp
- Re-scan button
- Share report button

Main first-screen card:
- Title: AI 结论
- Large risk label
- One-sentence summary
- 3–5 key risk reasons
- Action recommendation

Main content panels:
1. Buy/Sell Simulation
   - Can buy
   - Can sell
   - Buy tax
   - Sell tax
   - Transfer tax
   - Simulation timestamp
2. Contract Permissions
   - Owner status
   - Can modify tax
   - Blacklist function
   - Whitelist function
   - Pause trading
   - Mint permission
3. Liquidity and LP
   - Main pool
   - LP value
   - LP lock status
   - Pair asset
   - Recent liquidity removal
4. Holder Concentration
   - Holder count
   - Top 10 percentage
   - Deployer balance
5. Deployer Profile
   - Previous tokens
   - Known risk labels
6. Fake Token Warning
   - Similar official token name/symbol
   - Official contract mismatch

CTA section:
- Share risk report
- Check my wallet
- Report incorrect result

Tone:
- Clear, concise, safety-first
- Human-readable explanations instead of raw technical flags
- Do not say 'safe to invest'
- Show disclaimer: ChainVigil AI provides risk signals, not investment advice.

Visual:
- Report-like layout
- Card-based sections
- Critical risk first
- Strong but not frightening red usage for 禁买
- Mobile responsive
```

---

# 4. Token 报告分享图 Prompt

```text
Design an Open Graph / social share image template for ChainVigil AI token risk reports.

Canvas:
- 1200 x 630 social card
- Dark professional background
- ChainVigil AI logo

Content:
- Big risk label: 禁买 / 高危 / 谨慎 / 相对低风险 / 无法判断
- Token name and chain
- Short summary: 疑似貔貅盘 / 卖出失败 / LP 未锁 / Owner 可改税
- 3 compact risk chips
- Footer: Checked by ChainVigil AI

Example high-risk card:
- Title: 禁买：疑似貔貅盘
- Chips: 卖出失败 | LP 未锁 | Owner 可改税
- Token: PEPE2 on Base

Style:
- High contrast
- Minimal text
- Shareable in Telegram and X
- Do not look like a meme coin promo
- Do not include price prediction
```

---

# 5. 钱包体检页 Prompt

```text
Design a Wallet Health Check page for ChainVigil AI.

Page goal:
Allow users to check wallet risks without connecting wallet first.

User flow:
1. User enters wallet address
2. System scans high-risk approvals, unlimited approvals, risky tokens, fake tokens, dust assets, and spam NFTs
3. Show wallet health score and action recommendations
4. Encourage connecting wallet only when user wants to revoke approvals

Top section:
- Title: 钱包体检
- Subtitle: 输入钱包地址，先做只读扫描。无需连接钱包。
- Wallet address input
- Chain selector
- Button: 开始体检

Result page sections:
- Wallet health score card: 62/100
- High-risk approvals summary
- Unlimited approvals summary
- Risky token holdings summary
- Fake token warning summary
- Dust and spam asset summary
- Recommended actions
- CTA: 连接钱包清理高危授权

Important UX:
- First step must not require wallet connection
- Explain read-only scan clearly
- Use a calm risk dashboard style
- Do not scare users unnecessarily

Visual style:
- Dark dashboard
- Large health score card
- Risk summary cards
- Clear action hierarchy
```

---

# 6. 钱包健康报告页 Prompt

```text
Design a Wallet Health Report page for ChainVigil AI.

Page goal:
Show the user's wallet security and cleanliness status after a scan.

Header:
- Wallet address
- Supported chains scanned
- Scan timestamp
- Re-scan button
- Share summary button

Main cards:
1. Wallet Health Score
   - Score out of 100
   - Risk level label
   - Short AI summary
2. Critical Issues
   - High-risk approvals count
   - Known malicious spenders
   - Risky token holdings
3. Approval Risk
   - Total approvals
   - Unlimited approvals
   - High/Medium/Low split
4. Asset Hygiene
   - Dust assets
   - Spam tokens
   - Spam NFTs
   - Fake tokens
5. Recommended Actions
   - Revoke high-risk approvals
   - Review risky tokens
   - Hide spam assets

CTA:
- Connect wallet to revoke approvals
- View approval list
- Save report

Restrictions:
- Do not imply the wallet is hacked unless evidence exists
- Do not require wallet connection for viewing the report
```

---

# 7. 授权扫描页 Prompt

```text
Design an Approval Scanner page for ChainVigil AI.

Page goal:
Help users understand all token and NFT approvals across supported EVM chains and identify risky approvals.

Layout:
- Header: 授权扫描
- Summary cards:
  - Total approvals
  - High-risk approvals
  - Unlimited approvals
  - Estimated exposed value if available
- Filters:
  - Chain
  - Risk level
  - Token type: ERC20 / NFT
  - Approval type
  - Last used
- Approval table/list:
  - Asset
  - Spender / Operator
  - Allowance
  - Risk level
  - Risk reason
  - Last used
  - Action: View / Revoke

Interaction:
- Each row expandable with human-readable risk explanation
- High-risk items grouped at top
- Bulk select available but not aggressive

Visual:
- Security dashboard style
- Clear risk colors
- Dense but readable data table
- Mobile version uses stacked cards

Restrictions:
- Do not hide transaction intent
- Do not auto-revoke
```

---

# 8. 授权清理确认弹窗 Prompt

```text
Design a transaction confirmation modal for revoking a token approval in ChainVigil AI.

Purpose:
Before a user signs a revoke transaction, clearly explain what will happen.

Modal content:
- Title: 确认撤销授权
- Asset name and token address
- Spender / Operator address
- Current allowance
- Risk reason
- What this transaction does: 将该授权额度设置为 0 / 关闭 NFT operator 授权
- What this transaction does not do: 不会转走你的资产
- Estimated gas fee
- Checkbox: 我已理解撤销后可能影响该 DApp 的使用
- Buttons: 取消 / 确认撤销

Visual style:
- Serious but calm
- Use warning color only for risk details
- Make cancel option visible

Restrictions:
- Do not make the confirm button look like a casual action
- Do not use vague copy like 'Continue'
```

---

# 9. 资产理发师页 Prompt

```text
Design an Asset Barber page for ChainVigil AI.

Page goal:
Help users clean and organize wallet risks after buying: approvals, dust assets, spam tokens, spam NFTs, and messy low-value assets.

Important:
This page should focus on scan, classify, and recommend. Do not design automatic swap or bridge execution as the primary action.

Header:
- Title: 资产理发师
- Subtitle: 买后清理钱包隐患，识别粉尘资产、垃圾 Token、垃圾 NFT 和废弃授权。

Main sections:
1. Wallet Cleanliness Score
2. Risky approvals to clean
3. Dust assets summary
4. Spam tokens summary
5. Spam NFTs summary
6. Asset classification:
   - 可回收资产
   - 建议隐藏资产
   - 禁止处理资产
7. AI cleanup recommendation
8. Report generation

CTA:
- 扫描我的钱包
- 查看高危授权
- 生成清理报告

Visual:
- Clean dashboard feeling
- Use “barber / cleanup” metaphor lightly, not cartoonish
- Safety-first, not aggressive automation
```

---

# 10. 粉尘扫描页 Prompt

```text
Design a Dust Asset Scanner page for ChainVigil AI.

Page goal:
Show users which small wallet assets are worth recovering, which should be hidden, and which should not be touched.

Sections:
- Dust scan summary
- Total estimated dust value
- Estimated gas cost
- Net recoverable value
- Classification tabs:
  1. 可回收
  2. 不划算
  3. 建议隐藏
  4. 禁止处理
- Asset list cards:
  - Token name
  - Chain
  - Estimated value
  - Liquidity status
  - Risk label
  - Suggested action

Important copy:
- 不划算则不建议处理，避免倒贴 gas。
- 高危或无法判断资产不建议交互。

Restrictions:
- Do not design a one-click cross-chain swap as the default primary CTA
- Do not imply all dust can be safely converted
```

---

# 11. 哨点中心页 Prompt

```text
Design a Vigil Points center page for ChainVigil AI.

Brand terms:
- Chinese points name: 哨点
- English points name: Vigil Points
- Abbreviation: VP

Page goal:
Show user points, levels, contribution records, and available product benefits while avoiding token/airdrop promises.

Top section:
- Total VP
- User level
- Season progress
- Rank percentile

Breakdown cards:
- 成长哨点 Growth VP
- 贡献哨点 Contribution VP
- 推广哨点 Referral VP
- 待确认哨点 Pending VP

Activity section:
- Recent VP events
- Earned from CA scans
- Earned from risk reports
- Earned from wallet cleanup
- Earned from referrals

Benefits section:
- Higher daily scan quota
- Advanced reports
- Telegram Bot quota
- Community badges
- Future ecosystem activity eligibility reference

Important restrictions:
- Do not show token claim
- Do not show conversion ratio
- Do not say VP will become a token
- Do not use airdrop farming visual language

Visual:
- Premium but not speculative
- Use purple-gold accents for VP
- Clear distinction between confirmed and pending VP
```

---

# 12. 推广中心页 Prompt

```text
Design a Growth / Referral Center page for ChainVigil AI.

Page goal:
Help users earn Referral VP by sharing risk reports, inviting users to scan CAs, inviting Telegram Bot into real groups, and driving valid wallet health checks.

Sections:
1. My referral link
   - Copy link
   - QR code optional
2. Channel codes
   - X
   - Telegram group
   - Discord
   - YouTube
   - KOL campaign
3. Performance dashboard
   - Visits
   - Valid CA scans
   - Wallet health checks
   - Approval cleanups
   - Bot group installs
   - Confirmed VP
   - Pending VP
4. Share materials
   - CA scan poster
   - Risk report template
   - Telegram group message template
   - KOL post template
5. Leaderboard preview

Important principle:
Reward valid conversions, not empty clicks.

Copy examples:
- 分享一次风险预警，保护一个钱包，获得哨点 VP。
- 高价值推广奖励会进入待确认状态，通过反作弊审核后结算。

Restrictions:
- Do not use pyramid scheme or aggressive referral language
- Do not promise future token rewards
```

---

# 13. Telegram Bot 产品展示页 Prompt

```text
Design a product page section for ChainVigil AI Telegram Bot.

Page goal:
Convince Telegram group owners and Web3 communities to add the bot for CA risk checks.

Hero:
- Title: 把 ChainVigil AI 带进你的群
- Subtitle: 群友发 CA，Bot 一键检测貔貅、高税、黑名单、LP 风险和假币。
- CTA: 添加 Telegram Bot

Feature cards:
- /check CA instant scan
- High-risk alert
- Group safety report
- Group owner settings
- Referral VP for valid group activity

Demo chat mock:
User: /check 0x...
Bot: ChainVigil AI 检测结果：高危
Risks: 卖出税过高 | LP 未锁 | Owner 可改税
Full report link

Style:
- Show Telegram chat-like preview
- Clean and trustworthy
- Avoid spammy bot look
```

---

# 14. 风险数据库页 Prompt

```text
Design a Risk Database page for ChainVigil AI.

Page goal:
Show ChainVigil AI’s public risk intelligence: high-risk tokens, fake tokens, honeypots, risky deployers, malicious spenders, and weekly risk reports.

Sections:
- Search bar: search token address, deployer, spender, symbol
- Risk category cards:
  - 高危 CA
  - 假币数据库
  - 貔貅币数据库
  - 高危部署者
  - 恶意 Spender
  - 授权风险库
- Latest high-risk reports table
- Weekly risk report section
- Contributor attribution: first reported by

Table fields:
- Token / address
- Chain
- Risk level
- Main risk
- First detected
- Last updated
- Report link

Visual:
- Data intelligence platform style
- Strong search experience
- Filterable tables
- SEO-friendly layout
```

---

# 15. 高危 CA 榜单页 Prompt

```text
Design a High-Risk Token Leaderboard page for ChainVigil AI.

Page goal:
Show trending high-risk token contracts detected by ChainVigil AI.

Sections:
- Title: 高危 CA 榜
- Subtitle: 本榜单展示近期被多次查询、举报或检测为高危的 token。
- Filters: chain, risk type, time range
- Leaderboard table:
  - Rank
  - Token
  - Chain
  - Risk label
  - Main risk reason
  - Scan count
  - Share count
  - First reporter
  - Report link

Risk types:
- Honeypot
- High sell tax
- LP unlocked
- Fake token
- Blacklist
- Modifiable tax

CTA:
- Check a CA
- Report a risky token

Important:
- Add disclaimer that leaderboard is based on current risk signals, not investment advice.
```

---

# 16. 假币数据库页 Prompt

```text
Design a Fake Token Database page for ChainVigil AI.

Page goal:
Help users identify fake tokens impersonating USDT, USDC, WETH, PEPE, DOGE, and other popular assets.

Sections:
- Search input
- Official token reference cards
- Fake token list
- Compare official vs fake contract
- Warning examples

Fake token card fields:
- Fake token name
- Symbol
- Chain
- Contract address
- Impersonated token
- Risk reason
- Report link

Education block:
- Always verify contract address
- Token name and logo can be faked
- Do not trust random airdrops

Visual:
- Serious warning style
- Easy comparison cards
- Clear copy address buttons
```

---

# 17. 风险百科 / Learn 页 Prompt

```text
Design a Learn / Risk Education page for ChainVigil AI.

Page goal:
Educate users and support SEO/GEO for Web3 token safety topics.

Layout:
- Search bar
- Topic categories:
  - Honeypot / 貔貅盘
  - Sell tax / 买卖税
  - Blacklist / 黑名单
  - LP lock / 流动性锁定
  - Fake token / 假币
  - Approval risk / 授权风险
  - Dust assets / 粉尘资产
- Article cards
- Featured guide: 如何判断一个币是不是貔貅盘？
- CTA: 粘贴 CA 自动检测

Style:
- Educational but product-connected
- Clean article cards
- SEO-friendly

Important:
- Do not overwhelm with jargon
- Each topic should connect to a tool CTA
```

---

# 18. 价格页 Prompt

```text
Design a Pricing page for ChainVigil AI.

Page goal:
Show free, pro, community, and developer plans.

Plans:
1. Free
   - Basic CA scans
   - Basic reports
   - Limited daily quota
2. Pro
   - Advanced token reports
   - Wallet health check
   - Approval cleanup features
   - More daily scans
   - Risk monitoring
3. Community
   - Telegram Bot group features
   - Group safety reports
   - Higher group scan quota
4. Developer
   - Token Risk API
   - Risk label API
   - Webhooks
   - Higher rate limits

Important:
- Pricing should not mention token rewards
- VP can unlock product benefits, but do not show token conversion
- Include safety-first disclaimer

Visual:
- Clear comparison table
- Professional SaaS style
- Dark mode cards
```

---

# 19. 开发者中心 Prompt

```text
Design a Developer Center page for ChainVigil AI.

Page goal:
Let developers understand and access ChainVigil AI risk APIs.

Sections:
- Hero: Token Risk API for wallets, bots, and trading tools
- API products:
  - Token Risk API
  - Wallet Approval API
  - Malicious Address API
  - Fake Token API
  - Risk Label API
- Quick start code snippet
- API key CTA
- Docs navigation
- Usage analytics preview
- Pricing / rate limits

Visual:
- Developer-friendly dark docs style
- Code blocks
- API cards
- Clear CTA: Get API Key

Restrictions:
- Do not overpromise real-time complete coverage
- Include data freshness and risk disclaimer
```

---

# 20. App 控制台 Prompt

```text
Design an App Dashboard for ChainVigil AI logged-in users.

Page goal:
Give users a central place to view wallet risk, recent scans, VP, and recommended actions.

Sections:
- Welcome header
- Quick actions:
  - 查 CA
  - 钱包体检
  - 授权清理
  - 邀请 Bot
- Wallet health summary
- Recent token reports
- High-risk alerts
- VP summary
- Pending actions
- Recommended next step

Visual:
- Professional dashboard
- Modular cards
- Risk-first hierarchy
- VP secondary, not dominating the page

Important:
- Do not turn dashboard into a task farming page
- Keep safety actions primary
```

---

# 21. Admin 后台 Prompt

```text
Design an Admin dashboard for ChainVigil AI internal operations.

Page goal:
Allow internal admins to review token reports, risk labels, user reports, point events, referral fraud, Telegram groups, and API usage.

Navigation:
- Token Reports
- Risk Labels
- High-risk CA Review
- Fake Token Review
- User Reports
- VP Events
- Referral Fraud
- Telegram Groups
- KOL Channels
- API Usage
- System Config

Main dashboard cards:
- Pending high-risk reviews
- New user reports
- Possible false positives
- Suspicious VP events
- Bot groups needing review
- API error rate

Design style:
- Functional internal tool
- Dense tables
- Clear filters
- Audit log visible
- Risk evidence panels

Important:
- Every manual override should show audit log
- Make review workflow efficient
```

---

# 22. 移动端首页 Prompt

```text
Design a mobile-first landing page for ChainVigil AI.

Device:
- Mobile web, likely opened from Telegram, X, or wallet browser.

First screen:
- ChainVigil AI logo
- Title: 买币前，先查 CA。
- Token address input
- Button: 立即 CA 安检
- Note: 无需连接钱包

Below:
- Example high-risk result card
- Feature chips: 貔貅检测, 高税检测, LP 风险, 假币识别
- CTA: 检查我的钱包

Style:
- Dark mode
- Large input
- Thumb-friendly buttons
- No clutter
- Fast trust-building

Restrictions:
- Do not show complex desktop tables
- Do not make wallet connect primary
```

---

# 23. 移动端 Token 报告页 Prompt

```text
Design a mobile Token Risk Report page for ChainVigil AI.

First screen order:
1. Risk badge
2. Token name and chain
3. AI conclusion
4. Top 3 risk reasons
5. Share report button
6. Re-scan button

Below fold:
- Buy/sell simulation collapsible panel
- Contract permissions collapsible panel
- Liquidity collapsible panel
- Holder concentration collapsible panel
- Deployer profile collapsible panel
- Check my wallet CTA

Style:
- Mobile-first card layout
- Critical information at top
- Collapsible details
- Sticky bottom CTA optional: 检查我的钱包

Restrictions:
- Do not make users scroll to find the risk conclusion
```

---

# 24. 空状态组件 Prompt

```text
Design empty state components for ChainVigil AI.

Empty states needed:
1. CA scan empty state
   - Message: 粘贴 Token 合约地址或 DEX 链接，开始 CA 安检。
   - CTA: 立即 CA 安检
2. Wallet health empty state
   - Message: 输入钱包地址，先做一次只读体检。无需连接钱包。
   - CTA: 开始体检
3. Approval list empty state
   - Message: 未发现当前链上的活跃授权。你可以切换其他链继续检查。
4. VP empty state
   - Message: 完成 CA 安检、分享报告或清理高危授权，即可获得哨点 VP。

Style:
- Calm illustration or icon
- Not childish
- Clear next action
```

---

# 25. 错误状态组件 Prompt

```text
Design error state components for ChainVigil AI.

Error states:
- Invalid contract address
- Unsupported chain
- Token not found
- Simulation failed
- Data source unavailable
- Rate limited
- Wallet connection failed
- Transaction failed

Each error card should include:
- Clear title
- Human-readable explanation
- Suggested next step
- Retry button if applicable

Example:
Title: 暂时无法完成卖出仿真
Explanation: 可能是该 token 没有有效流动性、路由不支持或数据源暂时不可用。
Action: 稍后重新检测

Style:
- Calm, not alarming unless critical
- Use gray/yellow for uncertain errors
- Red only for confirmed critical risks
```

---

# 26. 全站导航 Prompt

```text
Design a global navigation system for ChainVigil AI.

Desktop nav:
- Logo: ChainVigil AI
- Nav items:
  - CA 安检
  - 钱包体检
  - 风险数据库
  - Telegram Bot
  - 开发者
  - 价格
- Secondary:
  - 哨点 VP
  - 登录
  - Launch App

Mobile nav:
- Logo
- Primary button: 查 CA
- Menu drawer with nav items

Important:
- The primary action should be CA scan, not connect wallet
- Keep nav simple and security-focused
```

---

# 27. 统一设计负面 Prompt

在所有 Stitch Prompt 后可以追加：

```text
Negative constraints:
- Do not use casino or gambling visual style.
- Do not use meme coin pump style.
- Do not make the page look like an airdrop farming campaign.
- Do not make Connect Wallet the primary CTA on public pages.
- Do not mention guaranteed token rewards.
- Do not say any token is safe to invest in.
- Do not overuse red color.
- Do not hide risk explanations behind technical jargon.
- Do not create an aggressive trading interface.
```

---

# 28. 推荐生成顺序

建议按以下顺序用 Stitch 生成：

1. 首页
2. CA 安检页
3. Token 风险报告页
4. Token 分享图
5. 移动端 Token 报告页
6. 钱包体检页
7. 钱包健康报告页
8. 授权扫描页
9. 授权清理确认弹窗
10. 哨点中心
11. 推广中心
12. Telegram Bot 产品展示页
13. 风险数据库
14. 高危 CA 榜单
15. 开发者中心
16. Admin 后台

---

# 29. 总结

ChainVigil AI 的设计应始终围绕：

```text
买币前，先查 CA。
先查后连。
先报告后执行。
风险说人话。
不承诺投资安全。
```

Stitch 生成的所有 UI 都应服务这个核心心智。

