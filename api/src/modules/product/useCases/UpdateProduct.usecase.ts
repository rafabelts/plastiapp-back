import { StatusCodes } from "http-status-codes";
import { CreateProduct } from "../product.model";
import { ProductRepository } from "../product.repository";
import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";

class UpdateProductUseCase {
  private repo: ProductRepository;

  constructor(repo: ProductRepository = new ProductRepository()) {
    this.repo = repo;
  }

  async execute(id: number, payload: Partial<CreateProduct>) {
    try {
      const updatedProduct = await this.repo.update(id, payload);
      return ServiceResponse.success("Product updated", updatedProduct);
    } catch (ex) {
      const errorMessage = `Error updating product: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while updating product",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const updateProductUseCase = new UpdateProductUseCase();
