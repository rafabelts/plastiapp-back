import type { Request, Response } from "express";
import { logger } from "@/server";
import { createCategoryUseCase } from "./useCases/CreateCategory.usecase";
import { getCategoriesUseCase } from "./useCases/GetCategories.usecase";
import { getCategoryUseCase } from "./useCases/GetCategory.usecase";
import { updateCategoryUseCase } from "./useCases/UpdateCategory.usecase";
import { softDeleteCategoryUseCase } from "./useCases/SoftDeleteCategory.usecase";

export class CategoryController {
  async create(req: Request, res: Response) {
    const {
      name,
    } = req.body;

    const userId = req.user!.userId;

    const response = await createCategoryUseCase.execute(userId, { name });
    return res.status(response.statusCode).send(response);
  }

  async getAll(req: Request, res: Response) {
    const response = await getCategoriesUseCase.execute();
    return res.status(response.statusCode).send(response);
  }

  async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id as string, 10);

    const response = await getCategoryUseCase.execute(id);
    return res.status(response.statusCode).send(response);
  }

  async update(req: Request, res: Response) {
    const {
      name,
    } = req.body;

    const id = Number.parseInt(req.params.id as string, 10);

    const response = await updateCategoryUseCase.execute(id, {
      name
    });
    return res.status(response.statusCode).send(response);
  }

  async softDelete(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id as string, 10);

    const response = await softDeleteCategoryUseCase.execute(id);
    return res.status(response.statusCode).send(response);
  }



}

export const categoryController = new CategoryController();
