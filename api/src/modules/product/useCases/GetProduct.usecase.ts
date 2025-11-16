import { logger } from "@/server";
import { ProductRepository } from "../product.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { Product } from "../product.model";

class GetProductUseCase {
  private repo: ProductRepository;
  constructor(repo: ProductRepository = new ProductRepository()) {
    this.repo = repo;
  };

  async execute(id: number) {
    try {
      const product = await this.repo.getById(id);

      if (!product) {
        return ServiceResponse.failure("Product not found", null, StatusCodes.NOT_FOUND)
      }

      return ServiceResponse.success<Product>("Product found", product);
    } catch (ex) {
      const errorMessage = `Error getting product: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while getting product",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getProductUseCase = new GetProductUseCase();
