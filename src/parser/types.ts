// src/parser/types.ts

export interface ParsedSource {
  filePath: string;
  exports: string[];
  usedHooks: string[];
  usedComponents: string[];
  conditions: string[];
  rawContent?: string;
}

export interface ParsedTest {
  filePath: string;
  imports: {
    source: string; // raw import path (e.g., '../components/Button')
    imported: {
      name: string;
      original?: string | undefined;
      isDefault: boolean;
    }[]; // named or default imports
  }[];
  testCases: {
    describe?: string;
    name: string;
    testedIdentifiers: string[];
    assertions: string[];
    raw?: string;
  }[];
}
