import { ParsedSource, ParsedTest } from "../parser/types";
export interface SourceFileCacheEntry {
    hash: string;
    usage?: ParsedSource;
    tested?: boolean;
    matchedTestFiles?: string[];
    aiSuggestion?: string;
    summary?: string[];
}
export interface TestFileCacheEntry {
    hash: string;
    testInfo?: ParsedTest;
    aiSuggestion?: string;
    summary?: string[];
}
export declare function getFileHash(content: string): string;
export declare function saveSourceCache(filePath: string, entry: SourceFileCacheEntry): void;
export declare function saveTestCache(filePath: string, entry: TestFileCacheEntry): void;
export declare function loadSourceCache(filePath: string): SourceFileCacheEntry | undefined;
export declare function loadTestCache(filePath: string): TestFileCacheEntry | undefined;
export declare function clearAllCache(): void;
export declare function isFileCachedUnchanged(filePath: string): boolean;
export type Cache = {
    sourceFiles: Record<string, SourceFileCacheEntry>;
    testFiles: Record<string, TestFileCacheEntry>;
};
export declare function loadAllCache(): Cache;
