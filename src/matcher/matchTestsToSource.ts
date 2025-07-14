import path from "path";
import fs from "fs";
import { ParsedSource, ParsedTest } from "../parser/types";
import { TestMatchResult } from "./types";

function normalizeFilePath(p: string): string {
  const extensions = [".ts", ".tsx", ".js", ".jsx"];

  if (fs.existsSync(p)) return path.resolve(p);

  for (const ext of extensions) {
    if (fs.existsSync(`${p}${ext}`)) return path.resolve(`${p}${ext}`);
    if (fs.existsSync(`${p}/index${ext}`))
      return path.resolve(`${p}/index${ext}`);
  }

  return ""; // not found
}

function resolveImportPath(testFilePath: string, importSource: string): string {
  const baseDir = path.dirname(testFilePath);
  const rawPath = path.resolve(baseDir, importSource);
  return normalizeFilePath(rawPath);
}

export function matchTestsToSourceFiles(
  sourceFiles: ParsedSource[],
  testFiles: ParsedTest[],
): TestMatchResult[] {
  const matches: TestMatchResult[] = [];

  for (const source of sourceFiles) {
    const resolvedSourcePath = path.resolve(source.filePath);

    const matchedTests = testFiles.filter((test) =>
      test.imports.some((importEntry) => {
        const resolvedImportPath = resolveImportPath(
          test.filePath,
          importEntry.source,
        );
        return resolvedImportPath === resolvedSourcePath;
      }),
    );

    matches.push({
      sourceFile: source,
      isTested: matchedTests.length > 0,
      matchedTestFiles: matchedTests.map((t) => t.filePath),
    });
  }

  return matches;
}
