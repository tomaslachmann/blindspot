import path from "path";
import { generatePrompt } from "../ai/generatePrompt";
import { chatCompletion, initOpenAI } from "../ai/openaiClient";
import type { Cache } from "../cache/cache";
import type { AnalyzerConfig } from "../config/types";
import { TestMatchResult } from "../matcher/types";

export async function runAIAnalysis(
  parsedSources: { filePath: string; usage: any }[],
  matches: TestMatchResult[],
  config: AnalyzerConfig,
  cache: Cache,
) {
  if (!config.enableAI || !config.openaiApiKey) return;

  initOpenAI(config.openaiApiKey);

  for (const match of matches) {
    const { sourceFile } = match;
    const filePath = sourceFile.filePath;
    const usage = cache[filePath]?.usage;
    if (!usage) {
      console.warn(
        `⚠️ Missing usage info for ${filePath}, skipping AI prompt.`,
      );
      continue;
    }
    const prompt = generatePrompt(usage, [match], config.testEngineConfig);

    try {
      console.log(
        `🤖 Running AI analysis for ${path.relative(process.cwd(), filePath)}...`,
      );
      const aiResult = await chatCompletion(
        [
          {
            role: "system",
            content: "You are a helpful test coverage assistant.",
          },
          { role: "user", content: prompt },
        ],
        config.aiModel,
      );

      cache[filePath].aiSuggestion = aiResult;

      console.log(
        `🤖 AI suggestion for ${path.relative(process.cwd(), filePath)}:\n${aiResult}\n`,
      );
    } catch (err) {
      console.error("❌ AI analysis error:", err);
    }
  }
}
