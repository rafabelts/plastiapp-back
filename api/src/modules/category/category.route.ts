import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { CategorySchema, CreateCategorySchema, GetCategorySchema } from "./category.model";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authenticateToken } from "@/common/middleware/authHandler";
import { categoryController } from "./category.controller";
import z from "zod";
import { requireAdmin } from "@/common/middleware/requireAdmin";

export const categoryRegistry = new OpenAPIRegistry();
export const categoryRouter: Router = Router();

categoryRegistry.registerPath({
  method: "post",
  summary: "Creates new product",
  security: [{ bearerAuth: [] }],
  path: "/api/category",
  tags: ["Category"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCategorySchema,
        },
      },
      required: true,
    },
  },
  responses: createApiResponse(CategorySchema, "Success"),
});

categoryRouter.post('/', authenticateToken, requireAdmin, categoryController.create);

categoryRegistry.registerPath({
  method: "get",
  summary: "Get products",
  security: [{ bearerAuth: [] }],
  path: "/api/category",
  tags: ["Category"],
  responses: createApiResponse(z.array(CategorySchema), "Success"),
});
categoryRouter.get('/', authenticateToken, categoryController.getAll);


categoryRegistry.registerPath({
  method: "get",
  summary: "Get product",
  security: [{ bearerAuth: [] }],
  path: "/api/category/{id}",
  request: { params: GetCategorySchema.shape.params },
  tags: ["Category"],
  responses: createApiResponse(CategorySchema, "Success"),
});
categoryRouter.get('/:id', authenticateToken, categoryController.getById);
