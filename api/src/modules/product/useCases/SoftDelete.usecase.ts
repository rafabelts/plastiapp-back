import { ServiceResponse } from "@/common/models/serviceResponse";
import { ProductRepository } from "../product.repository";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";

class SoftDeleteProductUseCase {
  private repo: ProductRepository;
  constructor(repo: ProductRepository = new ProductRepository) {
    this.repo = repo;
  }

  async execute(id: number) {
    try {
      const deletedProduct = await this.repo.softDelete(id);

      if (!deletedProduct) {
        return ServiceResponse.failure("Product not found", null, StatusCodes.NOT_FOUND)
      }

      return ServiceResponse.success("Product deleted (soft)", deletedProduct);
    } catch (ex) {
      const errorMessage = `Error deleting product: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while deleting product",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

  }
}

export const softDeleteProductUseCase = new SoftDeleteProductUseCase();
