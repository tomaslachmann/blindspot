import fg from "fast-glob";
import path from "path";

export async function discoverFiles(
  sourceDir: string,
  ignore: string[],
): Promise<string[]> {
  const files = await fg(`${sourceDir}/**/*.{ts,tsx,js,jsx}`, {
    ignore,
    absolute: true,
  });

  return files.filter((file) => {
    const base = path.basename(file);
    return (
      !base.endsWith(".d.ts") && // exclude declaration files
      base !== "types.ts" // exclude types.ts specifically
    );
  });
}
