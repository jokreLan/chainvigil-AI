import { buildMockWalletHealthReport } from "@chainvigil/risk-core";
import { ApprovalsClient } from "./approvals-client";

export default function ApprovalsPage() {
  const report = buildMockWalletHealthReport({
    address: "0x1111111111111111111111111111111111111110",
  });

  return <ApprovalsClient report={report} />;
}
