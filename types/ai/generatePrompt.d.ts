import { ParsedSource, ParsedTest } from "../parser/types";
import { AnalyzerConfig } from "../config/types";
export declare function generatePrompt(source: ParsedSource, allTests: ParsedTest[], testEngineConfig?: AnalyzerConfig): string;
