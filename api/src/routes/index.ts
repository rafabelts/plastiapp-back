import { authRouter } from "@/modules/auth/auth.router";
import { categoryRouter } from "@/modules/category/category.route";
import { healthCheckRouter } from "@/modules/healthCheck/healthCheck.router";
import { plasticRouter } from "@/modules/plastic/plastic.router";
import { productRouter } from "@/modules/product/product.router";
import express, { type Router } from "express";

const appRouter: Router = express.Router();

appRouter.use("/health-check", healthCheckRouter);
appRouter.use("/auth", authRouter);

appRouter.use("/product", productRouter);
appRouter.use("/category", categoryRouter);
appRouter.use("/plastic", plasticRouter);

export default appRouter;
