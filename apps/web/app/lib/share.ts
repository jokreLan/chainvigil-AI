export function appendReferralParam(reportUrl: string, referralCode: string): string {
  const url = new URL(reportUrl);
  url.searchParams.set("ref", referralCode);
  return url.toString();
}

export function buildTrackedShareText(shareText: string, reportUrl: string, trackedReportUrl: string): string {
  return shareText.includes(reportUrl)
    ? shareText.replace(reportUrl, trackedReportUrl)
    : `${shareText} ${trackedReportUrl}`;
}
