import { ParsedSource, ParsedTest } from "../parser/types";
import { TestMatchResult } from "./types";
export declare function matchTestsToSourceFiles(sourceFiles: ParsedSource[], testFiles: ParsedTest[]): TestMatchResult[];
