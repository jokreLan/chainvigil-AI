import { PrismaClient } from "@prisma/client";
import type { InputJsonArray, InputJsonObject } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const checkedAt = new Date("2026-07-08T00:00:00.000Z");
const tokenAddress = "0x1111111111111111111111111111111111111110";
const reportId = "seed-base-risk-report";
const userId = "seed-user";

async function main() {
  await prisma.tokenReport.upsert({
    where: {
      chain_tokenAddress: {
        chain: "base",
        tokenAddress,
      },
    },
    update: {
      riskLevel: "BLOCK",
      score: 12,
      summary: "疑似貔貅盘：卖出仿真失败，并伴随 LP 未锁等风险。",
      recommendation: "建议不要买入。如果已持有，优先尝试小额卖出，不要继续加仓。",
      checkedAt,
    },
    create: {
      id: reportId,
      chain: "base",
      tokenAddress,
      tokenName: "Mock Vigil Token",
      tokenSymbol: "MVP",
      riskLevel: "BLOCK",
      score: 12,
      summary: "疑似貔貅盘：卖出仿真失败，并伴随 LP 未锁等风险。",
      recommendation: "建议不要买入。如果已持有，优先尝试小额卖出，不要继续加仓。",
      checkedAt,
      snapshots: {
        create: {
          riskLevel: "BLOCK",
          score: 12,
          evidence: {
            canSell: false,
            honeypotDetected: true,
            lpLocked: false,
          } satisfies InputJsonObject,
          reasons: [
            "卖出路径存在异常",
            "LP 锁定状态未确认",
            "前 10 持仓集中度偏高",
          ] satisfies InputJsonArray,
          checkedAt,
        },
      },
      riskFactors: {
        create: [
          {
            key: "sell_simulation_failed",
            severity: "critical",
            title: "卖出路径存在异常",
            explanation: "mock 检测显示卖出仿真失败，存在买入后无法正常退出的风险。",
            evidence: { canSell: false } satisfies InputJsonObject,
          },
          {
            key: "lp_lock_unknown",
            severity: "medium",
            title: "LP 锁定状态未确认",
            explanation: "当前 mock 数据无法确认 LP 已锁定或燃烧，需要接入真实数据源后复核。",
            evidence: { lpLocked: false } satisfies InputJsonObject,
          },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: {
      referralCode: "seed-vigil",
    },
    update: {
      wallet: "0x2222222222222222222222222222222222222222",
    },
    create: {
      id: userId,
      wallet: "0x2222222222222222222222222222222222222222",
      referralCode: "seed-vigil",
    },
  });

  await prisma.pointEvent.upsert({
    where: {
      idempotencyKey: "seed:first-ca-check:base:0x1111111111111111111111111111111111111110",
    },
    update: {
      status: "pending",
    },
    create: {
      userId,
      type: "FIRST_CA_CHECK",
      ledger: "xp",
      status: "pending",
      points: 20,
      subjectType: "token",
      subjectId: `base:${tokenAddress}`,
      idempotencyKey: "seed:first-ca-check:base:0x1111111111111111111111111111111111111110",
      reason: "首次完成 CA 安检",
      metadata: {
        source: "seed",
      } satisfies InputJsonObject,
    },
  });

  await prisma.referralEvent.create({
    data: {
      referralCode: "seed-vigil",
      source: "seed",
      action: "share_effective_visit",
      subjectId: `base:${tokenAddress}`,
      metadata: {
        reportId,
      } satisfies InputJsonObject,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
