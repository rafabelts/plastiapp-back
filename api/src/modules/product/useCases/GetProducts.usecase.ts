import { logger } from "@/server";
import { ProductRepository } from "../product.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { Product } from "../product.model";

class GetProductsUseCase {
  private repo: ProductRepository;
  constructor(repo: ProductRepository = new ProductRepository()) {
    this.repo = repo;
  };

  async execute() {
    try {
      const products = await this.repo.getAll();

      if (!products || products.length === 0) {
        return ServiceResponse.failure("No products found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Array<Product>>("Products found", products);

    } catch (ex) {
      const errorMessage = `Error getting products: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while getting products",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getProductsUseCase = new GetProductsUseCase();
