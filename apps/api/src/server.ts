import { assertProductionRuntime, readEnv } from "@chainvigil/config";
import { buildApiApp } from "./app.js";

assertProductionRuntime();

const port = Number(readEnv("API_PORT", "4000"));
const host = readEnv("API_HOST", "0.0.0.0");
const app = await buildApiApp();

await app.listen({ port, host });
