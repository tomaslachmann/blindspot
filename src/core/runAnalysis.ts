import { loadCache, saveCache } from "../cache/cache";
import { AnalyzerConfig } from "../config/types";
import { matchTestsToSourceFiles } from "../matcher/matchTestsToSource";
import { promptGenerateTests } from "./interactivePrompt";
import { parseSources } from "./parseSources";
import { parseTests } from "./parseTests";
import { runAIAnalysis } from "./runAIAnalysis";
import path from "path";

export async function runAnalysis(
  sourceFiles: string[],
  testFiles: string[],
  config: AnalyzerConfig,
  useCache = true,
) {
  const cache = useCache ? loadCache() : {};

  const parsedSources = await parseSources(sourceFiles, cache, useCache);
  const parsedTests = parseTests(testFiles);

  const matches = matchTestsToSourceFiles(
    parsedSources.map(({ ast, filePath }) => ({
      filePath,
      exports: ast.exports,
    })),
    parsedTests,
  );

  // Update cache tested info
  for (const match of matches) {
    const { sourceFile, isTested, matchedTestFiles } = match;
    const filePath = sourceFile.filePath;
    cache[filePath] = {
      ...cache[filePath],
      tested: isTested,
      matchedTestFiles,
    };
    const relativePath = path.relative(
      process.cwd(),
      match.sourceFile.filePath,
    );

    if (match.isTested) {
      console.log(`✅ ${relativePath} is tested by:`);
      match.matchedTestFiles.forEach((tf) =>
        console.log(`   └── ${path.relative(process.cwd(), tf)}`),
      );
    } else {
      console.log(`❌ ${relativePath} is NOT tested`);
    }
  }

  await runAIAnalysis(parsedSources, matches, config, cache);

  // After AI suggestions cached and printed
  const untestedFiles = matches
    .filter((m) => !m.isTested)
    .map((m) => ({
      filePath: m.sourceFile.filePath,
    }));

  await promptGenerateTests(untestedFiles);

  if (useCache) saveCache(cache);
}
