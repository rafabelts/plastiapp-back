import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { LogInBodySchema, LogInSchema, RefreshTokenSchema } from "./auth.model";
import { authController } from "./auth.controller";
import { authenticateToken } from "@/common/middleware/authHandler";

export const authRegister = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegister.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your access token'
});

authRegister.registerPath({
  method: "post",
  description: "Login",
  path: "/api/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LogInBodySchema,
        },
      },
      required: true,
    },
  },
  responses: createApiResponse(LogInSchema, "Success"),
});

authRouter.post("/login", authController.login);

authRegister.registerPath({
  method: "post",
  description: "Refresh Access Token",
  path: "/api/auth/refresh",
  tags: ["Auth"],
  responses: createApiResponse(RefreshTokenSchema, "Success"),
});
authRouter.post("/refresh", authController.refresh);

authRegister.registerPath({
  method: "post",
  description: "Logout",
  security: [{ bearerAuth: [] }],
  path: "/api/auth/logout",
  tags: ["Auth"],
  responses: {}
});
authRouter.post("/logout", authenticateToken, authController.logout);
