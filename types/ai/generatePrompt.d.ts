import type { UsageAnalysis } from "../analyzer/analyzeUsages";
import type { TestMatchResult } from "../matcher/types";
export declare function generatePrompt(usage: UsageAnalysis, matchedTests: TestMatchResult[], testEngineConfig?: Record<string, unknown>): string;
