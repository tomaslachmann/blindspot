export interface UntestedFile {
    filePath: string;
}
export declare function promptGenerateTests(untestedFiles: UntestedFile[]): Promise<void>;
