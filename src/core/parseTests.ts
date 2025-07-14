import { parseTestFile } from "../parser/parseTestFile";

export function parseTests(testFiles: string[]) {
  return testFiles.map(parseTestFile);
}
