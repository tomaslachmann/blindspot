import * as t from "@babel/types";
import traverseNs from "@babel/traverse";
import { parse } from "@babel/parser";

export interface UsageAnalysis {
  filePath: string;
  exports: string[];
  usedHooks: string[];
  usedComponents: string[];
  conditions: string[];
}

// @ts-expect-error mismatch between ESM and CommonJS
const traverse = traverseNs.default as unknown as typeof traverseNs;

export function analyzeUsages(code: string, filePath: string): UsageAnalysis {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const exports = new Set<string>();
  const usedHooks = new Set<string>();
  const usedComponents = new Set<string>();
  const conditions = new Set<string>();

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const { declaration } = path.node;
      if (t.isFunctionDeclaration(declaration) && declaration.id?.name) {
        exports.add(declaration.id.name);
      }
      if (t.isVariableDeclaration(declaration)) {
        for (const decl of declaration.declarations) {
          if (t.isIdentifier(decl.id)) {
            exports.add(decl.id.name);
          }
        }
      }
    },
    ExportDefaultDeclaration(path) {
      if (t.isIdentifier(path.node.declaration)) {
        exports.add(path.node.declaration.name);
      }
    },
    CallExpression(path) {
      const callee = path.node.callee;
      if (t.isIdentifier(callee)) {
        if (callee.name.startsWith("use")) {
          usedHooks.add(callee.name);
        }
      }
    },
    JSXIdentifier(path) {
      const name = path.node.name;
      // Simple heuristic: lowercase = HTML tag, uppercase = component
      if (/^[A-Z]/.test(name)) {
        usedComponents.add(name);
      }
    },
    IfStatement(path) {
      conditions.add(path.node.test.type);
    },
    ConditionalExpression(path) {
      conditions.add("ternary");
    },
    LogicalExpression(path) {
      if (path.node.operator === "&&") {
        conditions.add("logical &&");
      }
    },
  });

  return {
    filePath,
    exports: Array.from(exports),
    usedHooks: Array.from(usedHooks),
    usedComponents: Array.from(usedComponents),
    conditions: Array.from(conditions),
  };
}
