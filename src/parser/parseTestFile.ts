import { parse } from "@babel/parser";
import traverseNs, { NodePath } from "@babel/traverse";
import generateNs from "@babel/generator";
import * as t from "@babel/types";
import { ParsedTest } from "./types";
import fs from "fs";

//@ts-ignore
const traverse = traverseNs.default as typeof traverseNs;

//@ts-ignore
const generate = generateNs.default as typeof generateNs;

export function parseTestFile(filePath: string): ParsedTest {
  const code = fs.readFileSync(filePath, "utf-8");
  const imports: ParsedTest["imports"] = [];
  const testCases: ParsedTest["testCases"] = [];
  let currentDescribe: string | undefined = undefined;

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  traverse(ast, {
    ImportDeclaration(p) {
      const source = p.node.source.value;
      const specs: ParsedTest["imports"][0]["imported"] = [];

      for (const s of p.node.specifiers) {
        if (t.isImportDefaultSpecifier(s)) {
          specs.push({ name: s.local.name, isDefault: true });
        } else if (t.isImportSpecifier(s)) {
          specs.push({
            name: s.local.name,
            original: t.isIdentifier(s.imported) ? s.imported.name : undefined,
            isDefault: false,
          });
        }
      }

      imports.push({ source, imported: specs });
    },

    CallExpression(p) {
      const callee = p.node.callee;

      // Handle describe block
      if (t.isIdentifier(callee) && callee.name === "describe") {
        const arg = p.node.arguments[0];
        if (t.isStringLiteral(arg)) {
          currentDescribe = arg.value;
        }
      }

      // Handle test or it block
      if (
        t.isIdentifier(callee) &&
        (callee.name === "it" || callee.name === "test")
      ) {
        const testNameNode = p.node.arguments[0];
        const testFnNode = p.node.arguments[1];

        if (
          t.isStringLiteral(testNameNode) &&
          (t.isFunction(testFnNode) || t.isArrowFunctionExpression(testFnNode))
        ) {
          const name = testNameNode.value;
          const testedIdentifiers: Set<string> = new Set();
          const assertions: string[] = [];

          traverse(
            testFnNode.body,
            {
              CallExpression(inner) {
                const innerCallee = inner.node.callee;
                if (t.isIdentifier(innerCallee)) {
                  if (
                    ["expect", "render", "renderHook"].includes(
                      innerCallee.name,
                    )
                  ) {
                    if (innerCallee.name === "expect") {
                      assertions.push(generate(inner.node).code);
                    } else {
                      inner.node.arguments.forEach((arg) => {
                        if (t.isIdentifier(arg)) {
                          testedIdentifiers.add(arg.name);
                        }
                        if (
                          t.isArrowFunctionExpression(arg) &&
                          t.isCallExpression(arg.body) &&
                          t.isIdentifier(arg.body.callee)
                        ) {
                          testedIdentifiers.add(arg.body.callee.name);
                        }
                      });
                    }
                  }
                }
              },
              JSXOpeningElement(inner) {
                if (t.isJSXIdentifier(inner.node.name)) {
                  testedIdentifiers.add(inner.node.name.name);
                }
              },
            },
            p.scope,
            p.state,
            p,
          );

          const raw = generate(testFnNode.body).code;
          testCases.push({
            describe: currentDescribe,
            name,
            testedIdentifiers: Array.from(testedIdentifiers),
            assertions,
            raw,
          });
        }
      }
    },
  });

  return {
    filePath,
    imports,
    testCases,
  };
}
