import { AnalyzerConfig } from "../config/types";
export declare function runAnalysis(sourceFiles: string[], testFiles: string[], config: AnalyzerConfig, useCache?: boolean): Promise<void>;
