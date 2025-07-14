import { ParsedSource } from "../parser/types";

export interface TestMatchResult {
  sourceFile: ParsedSource;
  isTested: boolean;
  matchedTestFiles: string[];
}
