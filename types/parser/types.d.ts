export interface ParsedSource {
    filePath: string;
    exports: string[];
}
export interface ParsedTest {
    filePath: string;
    imports: {
        source: string;
        imported: string[];
    }[];
    testedIdentifiers: string[];
}
