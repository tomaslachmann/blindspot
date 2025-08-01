import path from "path";
import { generatePrompt } from "../ai/generatePrompt";
import { chatCompletion, initOpenAI } from "../ai/openaiClient";
import type { AnalyzerConfig } from "../config/types";
import { ParsedSource, ParsedTest } from "../parser/types";
import { saveSourceCache, loadSourceCache } from "../cache/cache";

export async function runAIAnalysis(
  parsedSources: ParsedSource[],
  parsedTests: ParsedTest[],
  config: AnalyzerConfig,
) {
  if (!config.enableAI || !config.openaiApiKey) return;

  //initOpenAI(config.openaiApiKey);

  for (const sourceFile of parsedSources) {
    const filePath = sourceFile.filePath;
    const cacheEntry = loadSourceCache(filePath);
    const usage = cacheEntry?.usage;

    if (!usage) {
      console.warn(
        `⚠️ Missing usage info for ${filePath}, skipping AI prompt.`,
      );
      continue;
    }

    const prompt = generatePrompt(usage, parsedTests, config);

    try {
      console.log(
        `🤖 Running AI analysis for ${path.relative(process.cwd(), filePath)}...`,
      );

      /*const aiResult = await chatCompletion(
        [
          {
            role: "system",
            content: "You are a helpful test coverage assistant.",
          },
          { role: "user", content: prompt },
        ],
        config.aiModel,
      );*/

      saveSourceCache(filePath, {
        ...cacheEntry,
        aiSuggestion: prompt, //aiResult,
      });

      /*console.log(
        `🤖 AI suggestion for ${path.relative(process.cwd(), filePath)}:
${aiResult}
`,
      );*/
    } catch (err) {
      console.error("❌ AI analysis error:", err);
    }
  }
}
