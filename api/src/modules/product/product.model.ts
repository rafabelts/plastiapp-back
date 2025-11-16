import { commonValidations } from "@/common/utils/commonValidation";
import z from "zod";

export type Product = z.infer<typeof ProductSchema>;
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type DeletedProduct = z.infer<typeof DeletedProductSchema>;
export const DeletedProductSchema = z.object({
  id: z.number(),
  deletedAt: z.string()
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;
export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  categoryId: z.number()
});

export const GetProductSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
