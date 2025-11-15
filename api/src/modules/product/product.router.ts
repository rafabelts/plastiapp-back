import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { productController } from "./product.controller";
import { CreateProductSchema, GetProductSchema, ProductSchema } from "./product.model";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateToken } from "@/common/middleware/authHandler";
import { requireAdmin } from "@/common/middleware/requireAdmin";
import z from "zod";

export const productRegistry = new OpenAPIRegistry();
export const productRouter: Router = express.Router();

productRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your access token'
});

productRegistry.registerPath({
  method: "get",
  description: "Get products",
  security: [{ bearerAuth: [] }],
  path: "/api/product",
  tags: ["Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});
productRouter.get("/", authenticateToken, productController.getAll);


productRegistry.registerPath({
  method: "get",
  description: "Get product",
  security: [{ bearerAuth: [] }],
  path: "/api/product/{id}",
  tags: ["Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});
productRouter.get("/:id", authenticateToken, productController.getById);


productRegistry.registerPath({
  method: "post",
  description: "Creates new product",
  security: [{ bearerAuth: [] }],
  path: "/api/product",
  tags: ["Product"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateProductSchema,
        },
      },
      required: true,
    },
  },
  responses: createApiResponse(ProductSchema, "Success"),
});
productRouter.post("/", authenticateToken, requireAdmin, productController.create);


