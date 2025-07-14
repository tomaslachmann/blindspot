// src/config/loadConfig.ts

import { cosmiconfig } from "cosmiconfig";
import { AnalyzerConfig, TestEngine } from "./types.js";
import { defaultConfig } from "./defaultConfig.js";

export async function loadConfig(): Promise<AnalyzerConfig> {
  const blindspotExplorer = cosmiconfig("blindspot");
  const vitestExplorer = cosmiconfig("vitest");
  const jestExplorer = cosmiconfig("jest");

  const [blindspot, vitestResult, jestResult] = await Promise.all([
    blindspotExplorer.search(),
    vitestExplorer.search(),
    jestExplorer.search(),
  ]);

  const userConfig = blindspot?.config || {};
  // Detect and attach test engine config
  let testEngine = userConfig.testEngine;
  let testEngineConfig = undefined;

  if (!testEngine) {
    if (vitestResult?.config) {
      testEngine = TestEngine.VITEST;
      testEngineConfig = vitestResult.config;
    } else if (jestResult?.config) {
      testEngine = TestEngine.JEST;
      testEngineConfig = jestResult.config;
    }
  } else {
    if (testEngine === TestEngine.VITEST && vitestResult?.config) {
      testEngineConfig = vitestResult.config;
    }
    if (testEngine === TestEngine.JEST && jestResult?.config) {
      testEngineConfig = jestResult.config;
    }
  }

  return {
    ...defaultConfig,
    ...userConfig,
    testEngine,
    testEngineConfig,
  };
}
