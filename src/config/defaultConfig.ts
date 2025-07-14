// src/config/defaultConfig.ts

import { AnalyzerConfig, TestEngine } from "./types.js";

export const defaultConfig: AnalyzerConfig = {
  sourceDir: "src",
  testDir: "__tests__",
  testEngine: TestEngine.JEST,
  enableAI: false,
  ignore: ["node_modules", "dist"],
};
