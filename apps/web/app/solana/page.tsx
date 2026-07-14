import type { Metadata } from "next";
import { ChainTopicPage } from "../ui/chain-topic-page";

export const metadata: Metadata = {
  title: "Solana Token 安全检查｜ChainVigil AI",
  description: "买 Solana Token 前，先查 CA。用人话理解权限、流动性和集中持仓等基础风险信号。",
};

export default function SolanaTopicPage() {
  return <ChainTopicPage chain="solana" />;
}
