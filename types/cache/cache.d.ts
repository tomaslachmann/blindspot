export type CacheEntry = {
    hash: string;
    summary?: string[];
    tested?: boolean;
    usage?: {
        filePath: string;
        exports: string[];
        usedHooks: string[];
        usedComponents: string[];
        conditions: string[];
    };
    matchedTestFiles?: string[];
    aiSuggestion?: string;
};
export type Cache = Record<string, CacheEntry>;
export declare function ensureCacheDirExists(): void;
export declare function loadCache(): Cache;
export declare function saveCache(cache: Cache): void;
export declare function getFileHash(content: string): string;
export declare function isFileCachedUnchanged(filePath: string, content: string, cache: Cache): boolean;
export declare function clearCache(): void;
