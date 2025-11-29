import { commonValidations } from "@/common/utils/commonValidation";
import z from "zod";

export type Plastic = z.infer<typeof PlasticSchema>;
export const PlasticSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type CreatePlastic = z.infer<typeof CreatePlasticSchema>;
export const CreatePlasticSchema = z.object({
  name: z.string(),
  price: z.number()
});

export const GetPlasticSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export type DeletedPlastic = z.infer<typeof DeletedPlasticSchema>;
export const DeletedPlasticSchema = z.object({
  id: z.number(),
  deletedAt: z.string()
});
