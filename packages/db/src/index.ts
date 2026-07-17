import { Prisma, PrismaClient } from "@prisma/client";
import type { PointEvent, TokenRiskReport } from "@chainvigil/types";

export const prismaSchemaPath = "packages/db/prisma/schema.prisma";

export function isDatabaseConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(env.DATABASE_URL?.trim());
}

export interface DatabaseStore {
  ping(): Promise<boolean>;
  persistTokenReport(report: TokenRiskReport, evidence: unknown): Promise<void>;
  persistPointEvent(event: PointEvent): Promise<PointEvent>;
  persistReferralEvent(input: {
    referralCode: string;
    source: string;
    action: string;
    subjectId?: string;
  }): Promise<{ id: string; createdAt: string }>;
  getNorthStarMetrics(days: number): Promise<{
    days: number;
    scans: number;
    uniqueTokens: number;
    referrals: number;
    pointEvents: number;
  }>;
  close(): Promise<void>;
}

export function createDatabaseStore(
  env: Record<string, string | undefined> = process.env,
): DatabaseStore | null {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) return null;

  const client = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  return {
    async ping() {
      await client.$queryRaw`SELECT 1`;
      return true;
    },
    async persistTokenReport(report, evidence) {
      const checkedAt = new Date(report.checkedAt);
      await client.$transaction(async (tx) => {
        const stored = await tx.tokenReport.upsert({
          where: {
            chain_tokenAddress: {
              chain: report.chain,
              tokenAddress: report.tokenAddress,
            },
          },
          create: {
            chain: report.chain,
            tokenAddress: report.tokenAddress,
            tokenName: report.tokenName,
            tokenSymbol: report.tokenSymbol,
            riskLevel: report.riskLevel,
            score: report.score,
            summary: report.summary,
            recommendation: report.recommendation,
            checkedAt,
          },
          update: {
            tokenName: report.tokenName,
            tokenSymbol: report.tokenSymbol,
            riskLevel: report.riskLevel,
            score: report.score,
            summary: report.summary,
            recommendation: report.recommendation,
            checkedAt,
          },
        });
        await tx.tokenRiskSnapshot.create({
          data: {
            tokenReportId: stored.id,
            riskLevel: report.riskLevel,
            score: report.score,
            evidence: {
              reportEvidence: report.evidence,
              providerBundle: evidence,
              mode: report.mode,
              confidence: report.confidence,
            } as unknown as Prisma.InputJsonValue,
            reasons: report.reasons as unknown as Prisma.InputJsonValue,
            checkedAt,
          },
        });
      });
    },
    async persistPointEvent(event) {
      const stored = await client.pointEvent.upsert({
        where: { idempotencyKey: event.idempotencyKey },
        create: {
          type: event.type,
          ledger: event.ledger,
          status: event.status,
          points: event.points,
          subjectId: event.subjectId ?? null,
          idempotencyKey: event.idempotencyKey,
          reason: event.reason,
          metadata: event.actorId
            ? ({ actorId: event.actorId } as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          createdAt: new Date(event.createdAt),
        },
        update: {},
      });
      return {
        ...event,
        id: stored.id,
        createdAt: stored.createdAt.toISOString(),
      };
    },
    async persistReferralEvent(input) {
      const stored = await client.referralEvent.create({
        data: {
          referralCode: input.referralCode,
          source: input.source,
          action: input.action,
          subjectId: input.subjectId ?? null,
        },
      });
      return { id: stored.id, createdAt: stored.createdAt.toISOString() };
    },
    async getNorthStarMetrics(days) {
      const since = new Date(Date.now() - days * 86_400_000);
      const [scans, uniqueTokens, referrals, pointEvents] = await Promise.all([
        client.tokenRiskSnapshot.count({ where: { checkedAt: { gte: since } } }),
        client.tokenReport.count({ where: { checkedAt: { gte: since } } }),
        client.referralEvent.count({ where: { createdAt: { gte: since } } }),
        client.pointEvent.count({ where: { createdAt: { gte: since } } }),
      ]);
      return { days, scans, uniqueTokens, referrals, pointEvents };
    },
    async close() {
      await client.$disconnect();
    },
  };
}
