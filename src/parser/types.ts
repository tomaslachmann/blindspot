// src/parser/types.ts

export interface ParsedSource {
  filePath: string;
  exports: string[]; // e.g. ['LoginForm', 'useAuth']
}

export interface ParsedTest {
  filePath: string;
  imports: {
    source: string; // raw import path (e.g., '../components/Button')
    imported: string[]; // named or default imports
  }[];
  testedIdentifiers: string[];
}
