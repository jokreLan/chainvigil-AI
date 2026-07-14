import type { Metadata } from "next";
import { ChainTopicPage } from "../ui/chain-topic-page";

export const metadata: Metadata = {
  title: "BNB Smart Chain Token 安全检查｜ChainVigil AI",
  description: "买 BNB Smart Chain Token 前，先查 CA。用人话理解买卖限制、税率、权限和 LP 风险信号。",
};

export default function BnbTopicPage() {
  return <ChainTopicPage chain="bsc" />;
}
