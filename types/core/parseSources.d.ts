import { Cache } from "../cache/cache";
export declare function parseSources(sourceFiles: string[], cache: Cache, useCache: boolean): Promise<{
    filePath: string;
    ast: import("../parser/types").ParsedSource;
    usage: {
        filePath: string;
        exports: string[];
        usedHooks: string[];
        usedComponents: string[];
        conditions: string[];
    };
}[]>;
