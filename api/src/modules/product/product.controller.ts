import type { Request, Response } from "express";
import { createProductUseCase } from "./useCases/CreateProduct.usecase";
import { getProductsUseCase } from "./useCases/GetProducts.usecase";
import { getProductUseCase } from "./useCases/GetProduct.usecase";
import { logger } from "@/server";

export class ProductController {
  async create(req: Request, res: Response) {
    const {
      name,
      description,
      price
    } = req.body;

    const userId = req.user!.userId;

    const result = await createProductUseCase.execute(userId, { name, description, price });
    return res.status(result.statusCode).send(result);
  }

  async getAll(req: Request, res: Response) {
    const response = await getProductsUseCase.execute();
    res.status(response.statusCode).send(response);
  }

  async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id as string, 10);

    const response = await getProductUseCase.execute(id);

    res.status(response.statusCode).send(response);
  }

}

export const productController = new ProductController();
