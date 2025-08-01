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
    const matchedTestFiles: string[] = [];

    for (const test of testFiles) {
      for (const importEntry of test.imports) {
        const resolvedImportPath = resolveImportPath(
          test.filePath,
          importEntry.source,
        );

        if (resolvedImportPath === resolvedSourcePath) {
          // Check if any identifiers match the exported names
          const importedNames = importEntry.imported.map((i) => i.name);
          const testedNames = test.testCases.flatMap(
            (t) => t.testedIdentifiers,
          );

          const matchesExported = source.exports.some(
            (exp) => testedNames.includes(exp) || importedNames.includes(exp),
          );

          if (matchesExported) {
            matchedTestFiles.push(test.filePath);
            break;
          }
        }
      }
    }

    matches.push({
      sourceFile: source,
      isTested: matchedTestFiles.length > 0,
      matchedTestFiles,
    });
  }

  return matches;
}
