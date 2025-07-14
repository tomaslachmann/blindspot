import inquirer from "inquirer";

export interface UntestedFile {
  filePath: string;
}

export async function promptGenerateTests(untestedFiles: UntestedFile[]) {
  if (untestedFiles.length === 0) {
    console.log("✅ All files have tests.");
    return;
  }

  // Step 1: Ask user if they want to generate tests at all
  const { wantGenerate } = await inquirer.prompt<{ wantGenerate: boolean }>([
    {
      type: "confirm",
      name: "wantGenerate",
      message: "Do you want to generate tests for missing files?",
      default: false,
    },
  ]);

  if (!wantGenerate) {
    console.log("No test generation selected.");
    return;
  }

  // Step 2: Let user pick a file with arrow keys (interactive list)
  const choices = untestedFiles.map(({ filePath }) => ({
    name: filePath,
    value: filePath,
  }));

  const { selectedFile } = await inquirer.prompt<{ selectedFile: string }>([
    {
      type: "list",
      name: "selectedFile",
      message: "Select a file missing tests:",
      choices,
      pageSize: 10,
    },
  ]);

  console.log(`\nYou selected: ${selectedFile}`);
  console.log("Test generation is not implemented yet.\n");
}
