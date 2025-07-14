import type { UsageAnalysis } from "../analyzer/analyzeUsages";
import type { TestMatchResult } from "../matcher/types";

export function generatePrompt(
  usage: UsageAnalysis,
  matchedTests: TestMatchResult[],
  testEngineConfig?: Record<string, unknown>,
): string {
  const parts: string[] = [];

  parts.push(`You are a helpful react test coverage assistant.`);

  parts.push(
    `The following React source file exports: ${usage.exports.join(", ") || "none"}.`,
  );
  parts.push(`It uses hooks: ${usage.usedHooks.join(", ") || "none"}.`);
  parts.push(
    `It uses components: ${usage.usedComponents.join(", ") || "none"}.`,
  );
  parts.push(
    `It contains these control flow constructs: ${usage.conditions.join(", ") || "none"}.`,
  );

  if (matchedTests.length === 0) {
    parts.push(`No test files were found covering this file.`);
  } else {
    parts.push(`The following test files cover this file:`);
    for (const test of matchedTests) {
      parts.push(`- ${test.sourceFile.filePath}`);
    }
  }

  if (testEngineConfig) {
    parts.push(`Test engine config info: ${JSON.stringify(testEngineConfig)}`);
  }

  parts.push(
    `Based on this info, list potential missing or insufficiently tested parts of the source file.`,
  );

  return parts.join("\n");
}
