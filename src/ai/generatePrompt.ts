import { ParsedSource, ParsedTest } from "../parser/types";
import { AnalyzerConfig } from "../config/types";

export function generatePrompt(
  source: ParsedSource,
  allTests: ParsedTest[],
  testEngineConfig?: AnalyzerConfig,
): string {
  const prompt: string[] = [];

  // 1. Describe the source file
  prompt.push(`You're analyzing a React file at: ${source.filePath}`);
  prompt.push("\nIt exports the following identifiers:");
  prompt.push(JSON.stringify(source.exports, null, 2));
  prompt.push("\nInternally, it uses:");
  prompt.push(`Hooks: ${JSON.stringify(source.usedHooks, null, 2)}`);
  prompt.push(`Components: ${JSON.stringify(source.usedComponents, null, 2)}`);
  prompt.push(
    `Conditions/Patterns: ${JSON.stringify(source.conditions, null, 2)}`,
  );

  // 2. Describe where it's used (based on usage, assume `rawContent` is available)
  if (source.rawContent) {
    prompt.push("\nHere's the relevant source code to understand the logic:\n");
    prompt.push("```tsx");
    prompt.push(source.rawContent.slice(0, 1000)); // Cap to avoid token explosion
    prompt.push("```");
  }

  // 3. Match relevant test cases based on identifiers
  const testedIdentifiers = new Set(source.exports);
  const relevantTests: ParsedTest["testCases"] = [];

  for (const test of allTests) {
    for (const imp of test.imports) {
      for (const imported of imp.imported) {
        if (testedIdentifiers.has(imported.original || imported.name)) {
          for (const tc of test.testCases) {
            if (tc.testedIdentifiers.some((id) => id === imported.name)) {
              relevantTests.push(tc);
            }
          }
        }
      }
    }
  }

  // 4. Show covered test cases
  if (relevantTests.length > 0) {
    prompt.push("\nKnown test cases covering this file:");
    relevantTests.forEach((tc, i) => {
      prompt.push(`\n[${i + 1}] Test: "${tc.name}"`);
      if (tc.describe) prompt.push(`Describe Block: "${tc.describe}"`);
      prompt.push(
        "Tested identifiers: " + JSON.stringify(tc.testedIdentifiers),
      );
      prompt.push("Assertions:");
      tc.assertions.forEach((a) => prompt.push(`  - ${a}`));
    });
  } else {
    prompt.push("\n❌ No test cases are currently covering this file.");
  }

  // 5. Ask AI to reason
  prompt.push(
    "\n🤖 Based on how this file is used and what is already tested, suggest missing test scenarios or edge cases that should be covered.",
  );
  if (testEngineConfig?.testEngine) {
    prompt.push(`Use syntax compatible with ${testEngineConfig.testEngine}.`);
  }

  return prompt.join("\n");
}
