import type { Cache } from "../cache/cache";
import type { AnalyzerConfig } from "../config/types";
import { TestMatchResult } from "../matcher/types";
export declare function runAIAnalysis(parsedSources: {
    filePath: string;
    usage: any;
}[], matches: TestMatchResult[], config: AnalyzerConfig, cache: Cache): Promise<void>;
