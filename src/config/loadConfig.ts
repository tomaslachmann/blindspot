import { existsSync } from "fs";
import path from "path";
import { AnalyzerConfig } from "./types.js";
import { defaultConfig } from "./defaultConfig.js";

const CONFIG_NAMES = [
  "blindspot.config.ts",
  "blindspot.config.js",
  "blindspot.config.mjs",
  "blindspot.config.cjs",
];

export async function loadConfig(): Promise<AnalyzerConfig> {
  const cwd = process.cwd();

  const configPath = CONFIG_NAMES.map((file) => path.join(cwd, file)).find(
    (fullPath) => existsSync(fullPath),
  );

  if (!configPath) {
    console.warn("[blindspot] No config file found. Using default config.");
    return defaultConfig;
  }

  try {
    const configModule = await import(configPath);
    const userConfig = configModule.default ?? configModule;

    // Optionally add logic to detect test engine here
    return {
      ...defaultConfig,
      ...userConfig,
    };
  } catch (err) {
    console.error("[blindspot] Failed to load config:", err);
    return defaultConfig;
  }
}
