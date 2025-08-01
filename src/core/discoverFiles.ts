import fg from "fast-glob";
import path from "path";

export async function discoverFiles(
  sourceDir: string,
  ignore: string[],
  testDir?: string,
): Promise<string[]> {
  const files = await fg(`${sourceDir}/**/*.{ts,tsx,js,jsx}`, {
    ignore,
    absolute: true,
  });

  if (testDir) {
    const testFiles = await fg(`${testDir}/**/*.{ts,tsx,js,jsx}`, {
      ignore,
      absolute: true,
    });
    files.concat(testFiles);
  }

  return files.filter((file) => {
    const base = path.basename(file);
    return (
      !base.endsWith(".d.ts") && // exclude declaration files
      base !== "types.ts" &&
      !base.endsWith("rc.ts") &&
      !base.endsWith("rc.js") &&
      !base.includes(".config.") // exclude types.ts specifically
    );
  });
}
