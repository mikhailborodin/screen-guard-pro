import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, "dist");
const source = join(distDir, "index.html");
const destination = join(distDir, "support", "index.html");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
