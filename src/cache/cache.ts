import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = path.resolve(".blindspot");
const CACHE_FILE = path.join(CACHE_DIR, "cache.json");

export type CacheEntry = {
  hash: string;
  summary?: string[];
  tested?: boolean;
  usage?: {
    filePath: string;
    exports: string[];
    usedHooks: string[];
    usedComponents: string[];
    conditions: string[];
  };
  matchedTestFiles?: string[];
  aiSuggestion?: string; // <-- Add this for AI results
};

export type Cache = Record<string, CacheEntry>;

export function ensureCacheDirExists() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }
}

export function loadCache(): Cache {
  ensureCacheDirExists();
  if (!fs.existsSync(CACHE_FILE)) return {};
  const raw = fs.readFileSync(CACHE_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveCache(cache: Cache) {
  ensureCacheDirExists();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

export function getFileHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function isFileCachedUnchanged(
  filePath: string,
  content: string,
  cache: Cache,
): boolean {
  const cached = cache[filePath];
  const hash = getFileHash(content);
  return cached?.hash === hash;
}

export function clearCache() {
  if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE);
    console.log("🗑️  Cache cleared.");
  }
}
