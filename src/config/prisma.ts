import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// 1. Ensure .env is explicitly loaded before PrismaClient initializes
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// 2. Guarantee valid MongoDB database name in Atlas connection string
let dbUrl =
  process.env.DATABASE_URL ||
  "mongodb+srv://zhaevaah_db_user:Xui9zh5RKUYkg5F8@zhaevaah.kmbt1ox.mongodb.net/zhaevaah?retryWrites=true&w=majority";

if (dbUrl.includes("mongodb.net") && !dbUrl.includes("mongodb.net/zhaevaah")) {
  if (dbUrl.includes("mongodb.net/?")) {
    dbUrl = dbUrl.replace("mongodb.net/?", "mongodb.net/zhaevaah?");
  } else if (dbUrl.endsWith("mongodb.net/")) {
    dbUrl = `${dbUrl}zhaevaah?retryWrites=true&w=majority`;
  } else if (dbUrl.endsWith("mongodb.net")) {
    dbUrl = `${dbUrl}/zhaevaah?retryWrites=true&w=majority`;
  }
}

process.env.DATABASE_URL = dbUrl;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// Cache prisma client globally across serverless invocations to avoid connection pool exhaustion
global.__prisma = prisma;

export default prisma;
