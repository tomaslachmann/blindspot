// src/config/types.ts

export const TestEngine = {
  JEST: "jest",
  VITEST: "vitest",
} as const;

export type TestEngineType = (typeof TestEngine)[keyof typeof TestEngine];

export interface AnalyzerConfig {
  sourceDir: string;
  testDir: string;
  testEngine: TestEngineType;
  openaiApiKey?: string;
  aiModel?: string;
  enableAI?: boolean;
  ignore?: string[];
  testEngineConfig?: Record<string, unknown>;
}
