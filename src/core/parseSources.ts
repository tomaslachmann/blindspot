import fs from "fs";
import { parseSourceFile } from "../parser/parseSourceFile";
import { analyzeUsages } from "../analyzer/analyzeUsages";
import { getFileHash, isFileCachedUnchanged, Cache } from "../cache/cache";

export async function parseSources(
  sourceFiles: string[],
  cache: Cache,
  useCache: boolean,
) {
  const tempParsedSources = [];
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const hash = getFileHash(content);

    if (useCache && isFileCachedUnchanged(file, content, cache)) {
      const cachedUsage = cache[file]?.usage;
      const usage = cachedUsage ?? analyzeUsages(content, file);
      const ast = parseSourceFile(file);
      tempParsedSources.push({ filePath: file, ast, usage });
      continue;
    }

    const ast = parseSourceFile(file);
    const usage = analyzeUsages(content, file);
    tempParsedSources.push({ filePath: file, ast, usage });

    if (useCache) {
      cache[file] = { hash, usage };
    }
  }
  return tempParsedSources;
}
