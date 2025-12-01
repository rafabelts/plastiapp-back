import { authenticateToken } from "@/common/middleware/authHandler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { plasticController } from "./plastic.controller";
import { CreatePlasticSchema, DeletedPlasticSchema, GetPlasticSchema, PlasticSchema } from "./plastic.model";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import z from "zod";
import { requireAdmin } from "@/common/middleware/requireAdmin";

export const plasticRegistry = new OpenAPIRegistry();
export const plasticRouter: Router = Router();

plasticRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your access token'
});

plasticRegistry.registerPath({
  method: "post",
  summary: "Create a new plastic",
  security: [{ bearerAuth: [] }],
  path: "/api/plastic",
  tags: ["Plastic"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePlasticSchema
        }
      },
      required: true
    }
  },
  responses: createApiResponse(PlasticSchema, "Success")
});
plasticRouter.post("/", authenticateToken, requireAdmin, plasticController.create);

plasticRegistry.registerPath({
  method: "get",
  summary: "Get plastics",
  security: [{ bearerAuth: [] }],
  path: "/api/plastic",
  tags: ["Plastic"],
  responses: createApiResponse(z.array(PlasticSchema), "Success"),
});
plasticRouter.get("/", authenticateToken, plasticController.getAll);

plasticRegistry.registerPath({
  method: "get",
  summary: "Get plastic",
  security: [{ bearerAuth: [] }],
  path: "/api/plastic/{id}",
  request: { params: GetPlasticSchema.shape.params },
  tags: ["Plastic"],
  responses: createApiResponse(PlasticSchema, "Success"),
});
plasticRouter.get("/:id", authenticateToken, plasticController.getById);

plasticRegistry.registerPath({
  method: "put",
  summary: "Updates an existing plastic",
  security: [{ bearerAuth: [] }],
  path: "/api/plastic/{id}",
  tags: ["Plastic"],
  request: {
    params: GetPlasticSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: CreatePlasticSchema,
        },
      },
    },
  },
  responses: createApiResponse(PlasticSchema, "Success"),
});
plasticRouter.put("/:id", authenticateToken, requireAdmin, plasticController.update);

plasticRegistry.registerPath({
  method: "delete",
  summary: "Deletes an existing plastic",
  security: [{ bearerAuth: [] }],
  path: "/api/plastic/{id}",
  tags: ["Plastic"],
  request: {
    params: GetPlasticSchema.shape.params,
  },
  responses: createApiResponse(DeletedPlasticSchema, "Success"),
});
plasticRouter.delete("/:id", authenticateToken, plasticController.softDelete);
