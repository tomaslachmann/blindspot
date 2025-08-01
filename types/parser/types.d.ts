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
        source: string;
        imported: {
            name: string;
            original?: string | undefined;
            isDefault: boolean;
        }[];
    }[];
    testCases: {
        describe?: string;
        name: string;
        testedIdentifiers: string[];
        assertions: string[];
        raw?: string;
    }[];
}
