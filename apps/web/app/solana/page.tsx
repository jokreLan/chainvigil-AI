import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";
import { ChainTopicPage } from "../ui/chain-topic-page";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("solana");
}

export default function SolanaTopicPage() {
  return <ChainTopicPage chain="solana" />;
}
