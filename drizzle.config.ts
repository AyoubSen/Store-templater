import { defineConfig } from "drizzle-kit";
import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv(key: string) {
  if (process.env[key]) {
    return process.env[key];
  }

  if (!existsSync(".env.local")) {
    return "";
  }

  const line = readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .find((envLine) => envLine.trimStart().startsWith(`${key}=`));

  if (!line) {
    return "";
  }

  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: loadLocalEnv("DATABASE_URL"),
  },
});
