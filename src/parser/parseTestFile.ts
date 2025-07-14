// src/parser/parseTestFile.ts

import fs from "fs";
import * as parser from "@babel/parser";
import traverseModule from "@babel/traverse";
import { ParsedTest } from "./types";

// @ts-expect-error type error between commonJs and ESM
const traverse = traverseModule.default as unknown as typeof traverseModule;

export function parseTestFile(filePath: string): ParsedTest {
  const code = fs.readFileSync(filePath, "utf-8");

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const imports: ParsedTest["imports"] = [];
  const testedIdentifiers: string[] = [];

  traverse(ast, {
    ImportDeclaration(pathNode) {
      const importSource = pathNode.node.source.value;

      // Only match relative imports (for local source files)
      if (importSource.startsWith(".")) {
        const imported: string[] = [];

        for (const spec of pathNode.node.specifiers) {
          if (
            spec.type === "ImportSpecifier" ||
            spec.type === "ImportDefaultSpecifier" ||
            spec.type === "ImportNamespaceSpecifier"
          ) {
            imported.push(spec.local.name);
          }
        }

        imports.push({
          source: importSource,
          imported,
        });
      }
    },
    CallExpression(pathNode) {
      const callee = pathNode.node.callee;
      if (
        callee.type === "Identifier" &&
        ["describe", "it", "test"].includes(callee.name)
      ) {
        const arg = pathNode.node.arguments[0];
        if (arg?.type === "StringLiteral") {
          testedIdentifiers.push(arg.value);
        }
      }
    },
  });

  return {
    filePath,
    imports,
    testedIdentifiers,
  };
}
