import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const distDir = path.resolve(process.env.R2_DIST_DIR || "dist");
const dryRun = process.argv.includes("--dry-run") || process.env.R2_DRY_RUN === "true";
const concurrency = Number.parseInt(process.env.R2_UPLOAD_CONCURRENCY || "6", 10);
const immutableCacheControl =
  process.env.R2_IMMUTABLE_CACHE_CONTROL || "public, max-age=31536000, immutable";
const publicCacheControl = process.env.R2_PUBLIC_CACHE_CONTROL || "public, max-age=86400";

const requiredEnv = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"];

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizePrefix(prefix = "") {
  const trimmed = prefix.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `${trimmed}/` : "";
}

function toObjectKey(filePath) {
  const relativePath = path.relative(distDir, filePath).split(path.sep).join("/");
  return `${normalizePrefix(process.env.R2_ASSET_PREFIX)}${relativePath}`;
}

function shouldUpload(filePath) {
  const relativePath = path.relative(distDir, filePath).split(path.sep).join("/");
  return relativePath !== "index.html";
}

function isImmutableAsset(filePath) {
  const relativePath = path.relative(distDir, filePath).split(path.sep).join("/");
  return relativePath.startsWith("assets/");
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".avif": "image/avif",
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".m4a": "audio/mp4",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".ogg": "audio/ogg",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".wav": "audio/wav",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  return types[ext] || "application/octet-stream";
}

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectFiles(entryPath);
      if (entry.isFile() && shouldUpload(entryPath)) return [entryPath];
      return [];
    }),
  );

  return files.flat();
}

async function runPool(items, worker) {
  const queue = [...items];
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (item) await worker(item);
    }
  });
  await Promise.all(workers);
}

function createClient() {
  const accountId = required("R2_ACCOUNT_ID");
  return new S3Client({
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: "auto",
    forcePathStyle: true,
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });
}

async function main() {
  for (const name of requiredEnv) required(name);

  const bucket = required("R2_BUCKET");
  const prefix = normalizePrefix(process.env.R2_ASSET_PREFIX);
  const files = await collectFiles(distDir);
  const client = dryRun ? null : createClient();
  let uploadedBytes = 0;

  console.log(
    `${dryRun ? "Dry run" : "Uploading"} ${files.length} files from ${distDir} to r2://${bucket}/${prefix}`,
  );

  await runPool(files, async (filePath) => {
    const fileStats = await stat(filePath);
    const key = toObjectKey(filePath);
    const cacheControl = isImmutableAsset(filePath) ? immutableCacheControl : publicCacheControl;
    uploadedBytes += fileStats.size;

    if (dryRun) {
      console.log(`[dry-run] ${key} (${fileStats.size} bytes, ${cacheControl})`);
      return;
    }

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: createReadStream(filePath),
        ContentLength: fileStats.size,
        ContentType: contentTypeFor(filePath),
        CacheControl: cacheControl,
        ContentDisposition: "inline",
      }),
    );

    console.log(`uploaded ${key}`);
  });

  console.log(`Finished ${dryRun ? "checking" : "uploading"} ${(uploadedBytes / 1024 / 1024).toFixed(2)} MB.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
