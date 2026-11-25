import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

import prisma from "./config/prisma";
import { ensureDefaultAdmins } from "./controllers/authController";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import orderRoutes from "./routes/orderRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import { getCategories } from "./controllers/productController";

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration for Frontend, Admin & Vercel Deployments
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  process.env.ADMIN_URL || "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://www.zhaevaah.com",
  "https://zhaevaah.com",
  "https://root.zhaevaah.com",
  "https://zhaevaahv2.vercel.app",
  "https://www.zhaevaahv2.vercel.app",
  "https://admin.zhaevaah.vercel.app",
  "https://www.admin.zhaevaah.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, curl, Postman, or mobile apps with no origin
    if (!origin) {
      return callback(null, true);
    }
    // Allow explicitly listed origins, any vercel preview deployment, or localhost
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith(".zhaevaah.com") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1")
    ) {
      return callback(null, origin);
    }
    // Fallback: reflect requesting origin so credentials work
    return callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 204,
};

// 1. CORS MUST be the very first middleware to intercept preflight requests
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Security & Utility Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  express.json({
    limit: "10mb",
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check & Root
app.get("/", (req: Request, res: Response) => {
  const host = req.get("host") || `localhost:${PORT}`;
  const protocol =
    req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  const webhookUrl = `${baseUrl}/api/webhook/razorpay`;

  res.json({
    brand: "ZHAEVAAH",
    tagline: "Fine Diamond & 18kt Gold Jewellery REST API",
    status: "online",
    version: "1.0.0",
    webhook: {
      service: "Razorpay Payment Webhook",
      endpoint: "/api/webhook/razorpay",
      url: webhookUrl,
      localUrl: `http://localhost:${PORT}/api/webhook/razorpay`,
      status: "active",
      secretConfigured: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
      supportedEvents: ["payment.captured", "order.paid", "payment.failed"],
      dashboardSetupGuide: "Add this Webhook URL in Razorpay Dashboard > Settings > Webhooks",
    },
    docs: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      banners: "/api/banners",
      orders: "/api/orders",
      webhook: "/api/webhook/razorpay",
      paymentStatusCheck: "/api/orders/payment-status/:idOrNumber",
      admin: "/api/admin",
      upload: "/api/upload",
    },
  });
});

app.get("/health", async (req: Request, res: Response) => {
  try {
    // Ping database depending on active provider
    if (typeof (prisma as any).$runCommandRaw === "function") {
      await (prisma as any).$runCommandRaw({ ping: 1 });
    } else if (typeof (prisma as any).$queryRaw === "function") {
      await (prisma as any).$queryRaw`SELECT 1`;
    }
    res.json({ status: "healthy", database: "connected", timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.status(200).json({
      status: "degraded",
      database: "connecting_or_unreachable",
      message: err.message,
      hint: "Configure DATABASE_URL in .env to connect live MongoDB or PostgreSQL",
    });
  }
});

// API Routes
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.get("/api/categories", getCategories);
app.use("/api/banners", bannerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Unhandled Error]:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal atelier server error",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});

// Start Server (Only listen when running standalone, not inside Vercel serverless functions)
if (!process.env.VERCEL) {
  const server = app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`\n======================================================`);
    console.log(`✨ ZHAEVAAH Fine Jewellery API Server Running!`);
    console.log(`📍 Endpoint: http://localhost:${PORT}`);
    console.log(`⚡ Razorpay Webhook URL: http://localhost:${PORT}/api/webhook/razorpay`);
    console.log(`💎 Frontend: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
    console.log(`👑 Admin Dashboard: ${process.env.ADMIN_URL || "http://localhost:3001"}`);
    console.log(`======================================================\n`);
    ensureDefaultAdmins().catch((e) => console.warn("[Startup Admins]", e.message));
  });

  // Graceful Shutdown
  const handleShutdown = async () => {
    console.log("\n[Server] Shutting down gracefully...");
    server.close(async () => {
      await prisma.$disconnect();
      console.log("[Server] Database connection closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);
}

module.exports = app;
export default app;
