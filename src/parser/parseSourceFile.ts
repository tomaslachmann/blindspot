import fs from "fs";
import * as parser from "@babel/parser";
import traverseModule from "@babel/traverse";
import { ParsedSource } from "./types";

// @ts-expect-error type error between CommonJS and ESM
const traverse = traverseModule.default as unknown as typeof traverseModule;

export function parseSourceFile(filePath: string): ParsedSource {
  const code = fs.readFileSync(filePath, "utf-8");

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const exports: string[] = [];
  const usedHooks: string[] = [];
  const usedComponents: string[] = [];
  const conditions: string[] = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration?.type === "FunctionDeclaration") {
        const name = path.node.declaration.id?.name;
        if (name) exports.push(name);
      }

      if (path.node.specifiers) {
        for (const specifier of path.node.specifiers) {
          if (specifier.exported.type === "Identifier") {
            exports.push(specifier.exported.name);
          } else {
            exports.push((specifier.exported as any).value || "unknown");
          }
        }
      }
    },

    ExportDefaultDeclaration() {
      exports.push("default");
    },

    CallExpression(path) {
      const callee = path.node.callee;
      if (callee.type === "Identifier") {
        if (/^use[A-Z]/.test(callee.name)) {
          usedHooks.push(callee.name);
        }
      }
    },

    JSXOpeningElement(path) {
      if (path.node.name.type === "JSXIdentifier") {
        const name = path.node.name.name;
        if (/^[A-Z]/.test(name)) {
          usedComponents.push(name);
        }
      }
    },

    IfStatement() {
      conditions.push("if");
    },

    LogicalExpression(path) {
      conditions.push(`logical ${path.node.operator}`);
    },

    ConditionalExpression() {
      conditions.push("ternary");
    },
  });

  return {
    filePath,
    exports,
    usedHooks,
    usedComponents,
    conditions,
    rawContent: code,
  };
}
