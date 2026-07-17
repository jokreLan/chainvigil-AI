import { CheckPageClient } from "./check-page-client";

export default async function CheckPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  const { from } = (await searchParams) ?? {};
  return <CheckPageClient fromTask={from === "task"} />;
}
