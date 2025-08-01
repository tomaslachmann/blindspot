import fs from "fs";
import traverseModule from "@babel/traverse";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

// @ts-ignore
const traverse = traverseModule.default as unknown as typeof traverseModule;

export function isTestFile(code: string): boolean {
  let ast;
  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
  } catch (err: any) {
    if ("message" in err) {
      console.warn("[blindspot] Failed to parse file:", err?.message);
    }
    return false; // skip this file
  }

  let foundTestImport = false;
  let foundDescribeCall = false;

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (source.includes("vitest") || source.includes("jest")) {
        foundTestImport = true;
      }
    },
    CallExpression(path) {
      if (
        t.isIdentifier(path.node.callee) &&
        ["test", "describe", "it"].includes(path.node.callee.name)
      ) {
        foundDescribeCall = true;
      }
    },
  });

  return foundTestImport || foundDescribeCall;
}

export function splitTestAndSourceFiles(filePaths: string[]): {
  testFiles: string[];
  sourceFiles: string[];
} {
  const testFiles: string[] = [];
  const sourceFiles: string[] = [];

  for (const file of filePaths) {
    const code = fs.readFileSync(file, "utf-8");
    if (isTestFile(code)) {
      testFiles.push(file);
      console.log(file);
    } else {
      sourceFiles.push(file);
    }
  }

  return { testFiles, sourceFiles };
}
