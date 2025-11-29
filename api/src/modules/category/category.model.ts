import { commonValidations } from "@/common/utils/commonValidation";
import z from "zod";

export type Category = z.infer<typeof CategorySchema>;
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export const CreateCategorySchema = z.object({
  name: z.string(),
});

export const GetCategorySchema = z.object({
  params: z.object({ id: commonValidations.id }),
})

export type DeletedCategory = z.infer<typeof DeletedCategorySchema>;
export const DeletedCategorySchema = z.object({
  id: z.number(),
  deletedAt: z.string()
});
