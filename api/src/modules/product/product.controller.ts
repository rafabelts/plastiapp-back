import type { Request, Response } from "express";
import { createProductUseCase } from "./useCases/CreateProduct.usecase";
import { getProductsUseCase } from "./useCases/GetProducts.usecase";
import { getProductUseCase } from "./useCases/GetProduct.usecase";
import { logger } from "@/server";
import { updateProductUseCase } from "./useCases/UpdateProduct.usecase";
import { softDeleteProductUseCase } from "./useCases/SoftDelete.usecase";

export class ProductController {
  async create(req: Request, res: Response) {
    const {
      name,
      price,
      categoryId
    } = req.body;

    const userId = req.user!.userId;

    const response = await createProductUseCase.execute(userId, { name, price, categoryId });
    return res.status(response.statusCode).send(response);
  }

  async getAll(req: Request, res: Response) {
    const response = await getProductsUseCase.execute();
    return res.status(response.statusCode).send(response);
  }

  async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id as string, 10);

    const response = await getProductUseCase.execute(id);
    return res.status(response.statusCode).send(response);
  }

  async update(req: Request, res: Response) {
    const {
      name,
      price,
      categoryId
    } = req.body;

    const id = Number.parseInt(req.params.id as string, 10);

    const response = await updateProductUseCase.execute(id, {
      name,
      price,
      categoryId
    });
    return res.status(response.statusCode).send(response);
  }

  async softDelete(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id as string, 10);

    const response = await softDeleteProductUseCase.execute(id);
    return res.status(response.statusCode).send(response);
  }
}

export const productController = new ProductController();
