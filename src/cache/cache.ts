import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ParsedSource, ParsedTest } from "../parser/types";

export interface SourceFileCacheEntry {
  hash: string;
  usage?: ParsedSource;
  tested?: boolean;
  matchedTestFiles?: string[];
  aiSuggestion?: string;
  summary?: string[];
}

export interface TestFileCacheEntry {
  hash: string;
  testInfo?: ParsedTest;
  aiSuggestion?: string;
  summary?: string[];
}

const CACHE_ROOT = path.resolve(".blindspot/cache");
const SOURCE_DIR = path.join(CACHE_ROOT, "sources");
const TEST_DIR = path.join(CACHE_ROOT, "tests");

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function toCacheFileName(filePath: string): string {
  return Buffer.from(filePath).toString("base64") + ".json";
}

function fromCacheFileName(filename: string): string {
  return Buffer.from(filename.replace(/\.json$/, ""), "base64").toString(
    "utf8",
  );
}

export function getFileHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function saveSourceCache(filePath: string, entry: SourceFileCacheEntry) {
  ensureDirExists(SOURCE_DIR);
  const filename = toCacheFileName(filePath);
  fs.writeFileSync(
    path.join(SOURCE_DIR, filename),
    JSON.stringify(entry, null, 2),
  );
}

export function saveTestCache(filePath: string, entry: TestFileCacheEntry) {
  ensureDirExists(TEST_DIR);
  const filename = toCacheFileName(filePath);
  fs.writeFileSync(
    path.join(TEST_DIR, filename),
    JSON.stringify(entry, null, 2),
  );
}

export function loadSourceCache(
  filePath: string,
): SourceFileCacheEntry | undefined {
  const filename = toCacheFileName(filePath);
  const fullPath = path.join(SOURCE_DIR, filename);
  if (!fs.existsSync(fullPath)) return undefined;
  return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
}

export function loadTestCache(
  filePath: string,
): TestFileCacheEntry | undefined {
  const filename = toCacheFileName(filePath);
  const fullPath = path.join(TEST_DIR, filename);
  if (!fs.existsSync(fullPath)) return undefined;
  return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
}

export function clearAllCache() {
  if (fs.existsSync(CACHE_ROOT)) {
    fs.rmSync(CACHE_ROOT, { recursive: true, force: true });
    console.log("🗑️  Cache cleared.");
  }
}

export function isFileCachedUnchanged(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, "utf-8");
  const cached = loadSourceCache(filePath);
  if (!cached) return false;

  const currentHash = getFileHash(content);
  return cached.hash === currentHash;
}

export type Cache = {
  sourceFiles: Record<string, SourceFileCacheEntry>;
  testFiles: Record<string, TestFileCacheEntry>;
};

export function loadAllCache(): Cache {
  const sourceFiles: Record<string, SourceFileCacheEntry> = {};
  const testFiles: Record<string, TestFileCacheEntry> = {};

  if (fs.existsSync(SOURCE_DIR)) {
    for (const file of fs.readdirSync(SOURCE_DIR)) {
      const fullPath = path.join(SOURCE_DIR, file);
      try {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const parsed = JSON.parse(raw);
        const absPath = path.resolve(SOURCE_DIR, file.replace(/\\.json$/, ""));
        sourceFiles[absPath] = parsed;
      } catch {
        console.warn(`⚠️ Skipping corrupted source cache file: ${file}`);
      }
    }
  }

  if (fs.existsSync(TEST_DIR)) {
    for (const file of fs.readdirSync(TEST_DIR)) {
      const fullPath = path.join(TEST_DIR, file);
      try {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const parsed = JSON.parse(raw);
        const absPath = path.resolve(TEST_DIR, file.replace(/\\.json$/, ""));
        testFiles[absPath] = parsed;
      } catch {
        console.warn(`⚠️ Skipping corrupted test cache file: ${file}`);
      }
    }
  }

  return { sourceFiles, testFiles };
}
