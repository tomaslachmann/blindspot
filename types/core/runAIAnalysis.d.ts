import type { AnalyzerConfig } from "../config/types";
import { ParsedSource, ParsedTest } from "../parser/types";
export declare function runAIAnalysis(parsedSources: ParsedSource[], parsedTests: ParsedTest[], config: AnalyzerConfig): Promise<void>;
