import { listMockGrowthChannels } from "@chainvigil/points";
import { getServerLocale } from "../../i18n/server";
import { GrowthClient } from "./growth-client";

export default async function GrowthPage() {
  const locale = await getServerLocale();
  const channels = listMockGrowthChannels(locale);
  const confirmedVp = channels.reduce((sum, channel) => sum + channel.confirmedVp, 0);
  const pendingVp = channels.reduce((sum, channel) => sum + channel.pendingVp, 0);
  const visits = channels.reduce((sum, channel) => sum + channel.effectiveVisits, 0);
  const checks = channels.reduce((sum, channel) => sum + channel.effectiveCaChecks, 0);
  const primaryCode = channels[0]?.referralCode ?? "VIGIL";
  const referralLink = `https://chainvigil.ai/ref/${primaryCode}`;

  return (
    <GrowthClient
      channels={channels}
      confirmedVp={confirmedVp}
      pendingVp={pendingVp}
      visits={visits}
      checks={checks}
      referralLink={referralLink}
    />
  );
}
