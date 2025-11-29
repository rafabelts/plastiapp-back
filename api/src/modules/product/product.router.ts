import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { productController } from "./product.controller";
import { CreateProductSchema, DeletedProductSchema, GetProductSchema, ProductSchema } from "./product.model";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateToken } from "@/common/middleware/authHandler";
import { requireAdmin } from "@/common/middleware/requireAdmin";
import z from "zod";

export const productRegistry = new OpenAPIRegistry();
export const productRouter: Router = Router();

productRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your access token'
});


productRegistry.registerPath({
  method: "post",
  summary: "Creates new product",
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

productRegistry.registerPath({
  method: "get",
  summary: "Get products",
  security: [{ bearerAuth: [] }],
  path: "/api/product",
  tags: ["Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});
productRouter.get("/", authenticateToken, productController.getAll);


productRegistry.registerPath({
  method: "get",
  summary: "Get product",
  security: [{ bearerAuth: [] }],
  path: "/api/product/{id}",
  tags: ["Product"],
  request: { params: GetProductSchema.shape.params },
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});
productRouter.get("/:id", authenticateToken, productController.getById);


productRegistry.registerPath({
  method: "put",
  summary: "Updates an existing product",
  security: [{ bearerAuth: [] }],
  path: "/api/product/{id}",
  tags: ["Product"],
  request: {
    params: GetProductSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: CreateProductSchema,
        },
      },
    },
  },
  responses: createApiResponse(ProductSchema, "Success"),
});
productRouter.put("/:id", authenticateToken, requireAdmin, productController.update);

productRegistry.registerPath({
  method: "delete",
  summary: "Deletes an existing product",
  security: [{ bearerAuth: [] }],
  path: "/api/product/{id}",
  tags: ["Product"],
  request: {
    params: GetProductSchema.shape.params,
  },
  responses: createApiResponse(DeletedProductSchema, "Success"),
});
productRouter.delete("/:id", authenticateToken, productController.softDelete);
