import { AuthRepository } from "@/modules/auth/auth.repository";
import { ProductRepository } from "../product.repository";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { CreateProduct } from "../product.model";

class CreateProductUseCase {
  private repo: ProductRepository;

  constructor(repo: ProductRepository = new ProductRepository) {
    this.repo = repo;
  }

  async execute(createdBy: number, payload: CreateProduct) {
    try {
      const product = await this.repo.create(payload);

      return ServiceResponse.success("Product created", {
        id: product.product_id,
        name: product.name,
        description: product.description,
        price: product.price

      });
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while creating user",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export const createProductUseCase = new CreateProductUseCase(
  new ProductRepository()
)
