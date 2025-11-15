import { authRouter } from "@/modules/auth/auth.router";
import { healthCheckRouter } from "@/modules/healthCheck/healthCheck.router";
import { productRouter } from "@/modules/product/product.router";
import express, { type Router } from "express";

const appRouter: Router = express.Router();

appRouter.use("/health-check", healthCheckRouter);
appRouter.use("/auth", authRouter);

appRouter.use("/product", productRouter);



export default appRouter;
