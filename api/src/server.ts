import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import registerApiRoutes from "@/common/core/registerApiRoutes";
import appRouter from "@/routes";
import { openAPIRouter } from "./api-docs/openAPIRouter";
import cookieParser from "cookie-parser";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
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
