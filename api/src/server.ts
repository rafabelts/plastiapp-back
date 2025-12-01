import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import registerApiRoutes from "@/common/core/registerApiRoutes";
import appRouter from "@/routes";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import cookieParser from "cookie-parser";
import rateLimiter from "./common/middleware/rateLimiter";
import helmet from "helmet";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cors config
app.use(cors({
    origin: env.CORS_ORIGIN, credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// doc
app.use(openAPIRouter)

// Redirect / to /api/docs
app.get("/", (_req, res) => {
    res.redirect("/api/docs");
});

// Routes
registerApiRoutes(app, appRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
