import { loadConfig } from "./config/loadConfig";
import { discoverFiles } from "./core/discoverFiles";
import { splitTestAndSourceFiles } from "./core/identifyTestFiles";
import { runAnalysis } from "./core/runAnalysis";

export async function run(options: { useCache: boolean }) {
  console.log("🔍 React Blindspot: Analyzing tests...\n");
  const config = await loadConfig();
  const allFiles = await discoverFiles(
    config.sourceDir,
    config.ignore || [],
    config.testDir,
  );
  const { testFiles, sourceFiles } = splitTestAndSourceFiles(allFiles);
  runAnalysis(sourceFiles, testFiles, config, options.useCache);
}
