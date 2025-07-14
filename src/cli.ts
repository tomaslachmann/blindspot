import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { run } from "./index";
import { loadConfig } from "./config/loadConfig";
import { clearCache } from "./cache/cache";

yargs(hideBin(process.argv))
  .scriptName("blindspot")
  .option("reset-cache", {
    type: "boolean",
    description: "Clear cached analysis before running",
  })
  .option("no-cache", {
    type: "boolean",
    description: "Disable reading/writing from the cache",
  })
  .option("show-config", {
    type: "boolean",
    description: "Print the resolved config and exit",
  })
  .command(
    "*",
    "Analyze the test coverage of your React project",
    () => {},
    async (argv) => {
      if (argv["reset-cache"]) {
        clearCache();
      }

      if (argv["show-config"]) {
        const config = await loadConfig();
        console.log(JSON.stringify(config, null, 2));
        return;
      }

      await run({ useCache: !argv["no-cache"] });
    },
  )
  .help()
  .parseAsync();
