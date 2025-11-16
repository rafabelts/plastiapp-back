import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { CategoryRepository } from "../category.repository";
import { Category } from "../category.model";

class GetCategoriesUseCase {
  private repo: CategoryRepository;
  constructor(repo: CategoryRepository = new CategoryRepository()) {
    this.repo = repo;
  };

  async execute() {
    try {
      const categories = await this.repo.getAll();

      if (!categories || categories.length === 0) {
        return ServiceResponse.failure("No categories found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Array<Category>>("Categories found", categories);
    } catch (ex) {
      const errorMessage = `Error getting categories: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while getting categories",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getCategoriesUseCase = new GetCategoriesUseCase();
