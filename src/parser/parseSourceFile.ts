// src/parser/parseSourceFile.ts

import fs from "fs";
import * as parser from "@babel/parser";
import traverseModule from "@babel/traverse";
import { ParsedSource } from "./types";

// @ts-expect-error type error between commonJs and ESM
const traverse = traverseModule.default as unknown as typeof traverseModule;

export function parseSourceFile(filePath: string): ParsedSource {
  const code = fs.readFileSync(filePath, "utf-8");

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const exports: string[] = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration?.type === "FunctionDeclaration") {
        const name = path.node.declaration.id?.name;
        if (name) exports.push(name);
      }

      if (path.node.specifiers) {
        for (const specifier of path.node.specifiers) {
          // Check if exported is an Identifier before accessing `.name`
          if (specifier.exported.type === "Identifier") {
            exports.push(specifier.exported.name);
          } else {
            // fallback: include raw value for string literals (rare)
            exports.push((specifier.exported as any).value || "unknown");
          }
        }
      }
    },
    ExportDefaultDeclaration(path) {
      exports.push("default");
    },
  });

  return {
    filePath,
    exports,
  };
}
