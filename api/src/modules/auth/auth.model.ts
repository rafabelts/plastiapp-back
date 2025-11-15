import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type LogIn = z.infer<typeof LogInSchema>;
export const LogInSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
}).openapi("LogInResponse");

export type LogInBody = z.infer<typeof LogInBodySchema>;
export const LogInBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export const RefreshTokenSchema = z.object({
  accessToken: z.string()
})

export type CreatedUser = z.infer<typeof CreatedUserSchema>;
export const CreatedUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  birthDate: z.string(),
  userTypeId: z.number(),
  createdById: z.number(),
});


export type CreateUser = z.infer<typeof CreateUserSchema>;
export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  birthDate: z.string(),
  userTypeId: z.number()
});
