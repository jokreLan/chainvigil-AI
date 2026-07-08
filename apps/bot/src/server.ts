import { readEnv } from "@chainvigil/config";
import { buildBotApp } from "./app.js";

const port = Number(readEnv("BOT_PORT", "4001"));
const host = readEnv("BOT_HOST", "0.0.0.0");
const app = buildBotApp();

await app.listen({ port, host });
