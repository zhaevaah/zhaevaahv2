import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const prismaDir = path.join(__dirname, "..", "prisma");
const activeSchemaPath = path.join(prismaDir, "schema.prisma");
const mongoSchemaPath = path.join(prismaDir, "schema.mongodb.prisma");
const postgresSchemaPath = path.join(prismaDir, "schema.postgresql.prisma");

const arg = process.argv[2]?.toLowerCase();
const dbUrl = process.env.DATABASE_URL || "";

let targetProvider = "mongodb"; // default as requested

if (arg === "postgres" || arg === "postgresql") {
  targetProvider = "postgresql";
} else if (arg === "mongo" || arg === "mongodb") {
  targetProvider = "mongodb";
} else {
  // Auto-detect from DATABASE_URL
  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    targetProvider = "postgresql";
  } else if (dbUrl.startsWith("mongodb://") || dbUrl.startsWith("mongodb+srv://")) {
    targetProvider = "mongodb";
  }
}

console.log(`\n======================================================`);
console.log(`[ZHAEVAAH DB Switcher] Target Provider: ${targetProvider.toUpperCase()}`);
console.log(`======================================================`);

// Check current provider in active schema
let currentProvider = "";
if (fs.existsSync(activeSchemaPath)) {
  const content = fs.readFileSync(activeSchemaPath, "utf8");
  const match = content.match(/provider\s*=\s*["']([^"']+)["']/);
  if (match) {
    currentProvider = match[1];
  }
}

const clientGenerated = fs.existsSync(path.join(__dirname, "..", "node_modules", ".prisma", "client"));
const needsSwitch = currentProvider !== targetProvider;

if (needsSwitch) {
  console.log(`[DB Switcher] Switching schema from "${currentProvider}" to "${targetProvider}"...`);
  const sourcePath = targetProvider === "postgresql" ? postgresSchemaPath : mongoSchemaPath;
  if (!fs.existsSync(sourcePath)) {
    console.error(`[DB Switcher] Error: Source schema file not found at ${sourcePath}`);
    process.exit(1);
  }
  fs.copyFileSync(sourcePath, activeSchemaPath);
  console.log(`[DB Switcher] Copied ${path.basename(sourcePath)} -> schema.prisma`);
} else {
  console.log(`[DB Switcher] Active schema is already set to "${targetProvider}".`);
}

// Generate Prisma client if switched or not yet generated
if (needsSwitch || !clientGenerated) {
  console.log(`[DB Switcher] Running "npx prisma generate"...`);
  try {
    execSync("npx prisma generate", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      env: process.env,
    });
    console.log(`[DB Switcher] Prisma client generated successfully for ${targetProvider}!\n`);
  } catch (err) {
    console.error(`[DB Switcher] Error generating Prisma client:`, err.message);
  }
} else {
  console.log(`[DB Switcher] Prisma client is up-to-date.\n`);
}
