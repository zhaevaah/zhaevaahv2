"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", ".env") });
const prisma_1 = __importDefault(require("./config/prisma"));
const authController_1 = require("./controllers/authController");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const productController_1 = require("./controllers/productController");
const app = (0, express_1.default)();
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
const corsOptions = {
    origin: (origin, callback) => {
        // Allow server-to-server, curl, Postman, or mobile apps with no origin
        if (!origin) {
            return callback(null, true);
        }
        // Allow explicitly listed origins, any vercel preview deployment, or localhost
        if (allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.endsWith(".zhaevaah.com") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1")) {
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
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
// Security & Utility Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    },
}));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Health Check & Root
app.get("/", (req, res) => {
    const host = req.get("host") || `localhost:${PORT}`;
    const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
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
app.get("/health", async (req, res) => {
    try {
        // Ping database depending on active provider
        if (typeof prisma_1.default.$runCommandRaw === "function") {
            await prisma_1.default.$runCommandRaw({ ping: 1 });
        }
        else if (typeof prisma_1.default.$queryRaw === "function") {
            await prisma_1.default.$queryRaw `SELECT 1`;
        }
        res.json({ status: "healthy", database: "connected", timestamp: new Date().toISOString() });
    }
    catch (err) {
        res.status(200).json({
            status: "degraded",
            database: "connecting_or_unreachable",
            message: err.message,
            hint: "Configure DATABASE_URL in .env to connect live MongoDB or PostgreSQL",
        });
    }
});
// API Routes
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../public/uploads")));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "public/uploads")));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.get("/api/categories", productController_1.getCategories);
app.use("/api/banners", bannerRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/webhook", webhookRoutes_1.default);
app.use("/webhook", webhookRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
});
// Centralized Error Handler
app.use((err, req, res, next) => {
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
        (0, authController_1.ensureDefaultAdmins)().catch((e) => console.warn("[Startup Admins]", e.message));
    });
    // Graceful Shutdown
    const handleShutdown = async () => {
        console.log("\n[Server] Shutting down gracefully...");
        server.close(async () => {
            await prisma_1.default.$disconnect();
            console.log("[Server] Database connection closed.");
            process.exit(0);
        });
    };
    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
}
module.exports = app;
exports.default = app;
