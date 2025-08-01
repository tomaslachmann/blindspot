import { parseSourceFile } from "../parser/parseSourceFile";
import {
  getFileHash,
  isFileCachedUnchanged,
  loadSourceCache,
  saveSourceCache,
  SourceFileCacheEntry,
} from "../cache/cache";
import { ParsedSource } from "../parser/types";

export async function parseSources(
  sourceFiles: string[],
  useCache: boolean,
): Promise<ParsedSource[]> {
  const parsedSources: ParsedSource[] = [];

  for (const file of sourceFiles) {
    if (useCache && isFileCachedUnchanged(file)) {
      const cached = loadSourceCache(file);
      if (cached?.usage) {
        parsedSources.push(cached.usage);
        continue;
      }
    }

    const parsed = parseSourceFile(file);
    const hash = getFileHash(parsed.rawContent || "");

    parsedSources.push(parsed);

    if (useCache) {
      const cacheEntry: SourceFileCacheEntry = {
        hash,
        usage: parsed,
        tested: false,
        matchedTestFiles: [],
      };
      saveSourceCache(file, cacheEntry);
    }
  }

  return parsedSources;
}
