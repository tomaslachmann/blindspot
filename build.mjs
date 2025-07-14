import { build } from "esbuild";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

await build({
  entryPoints: ["./src/cli.ts"],
  outfile: "./dist/reactblindspot.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  banner: {
    js: "#!/usr/bin/env node",
  },
  sourcemap: true,
  external: Object.keys(pkg.dependencies || {}),
});
