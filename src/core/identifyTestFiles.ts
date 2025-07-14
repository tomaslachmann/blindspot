import fs from "fs";

export function isTestFileByContent(filePath: string): boolean {
  const code = fs.readFileSync(filePath, "utf-8");
  return (
    code.includes("describe(") || code.includes("test(") || code.includes("it(")
  );
}

export function splitTestAndSourceFiles(filePaths: string[]): {
  testFiles: string[];
  sourceFiles: string[];
} {
  const testFiles: string[] = [];
  const sourceFiles: string[] = [];

  for (const file of filePaths) {
    if (isTestFileByContent(file)) {
      testFiles.push(file);
    } else {
      sourceFiles.push(file);
    }
  }

  return { testFiles, sourceFiles };
}
