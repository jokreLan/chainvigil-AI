import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChainVigil",
    short_name: "ChainVigil",
    description: "买币前，先查 CA。AI 驱动的 Web3 token 与钱包风险扫描工具。",
    start_url: "/",
    display: "standalone",
    background_color: "#07100d",
    theme_color: "#34d399",
    categories: ["finance", "security", "utilities"],
  };
}
