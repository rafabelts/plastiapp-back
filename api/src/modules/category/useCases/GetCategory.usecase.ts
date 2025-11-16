import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { CategoryRepository } from "../category.repository";
import { Category } from "../category.model";

class GetCategoryUseCase {
  private repo: CategoryRepository;
  constructor(repo: CategoryRepository = new CategoryRepository()) {
    this.repo = repo;
  };

  async execute(id: number) {
    try {
      const category = await this.repo.getById(id);

      if (!category) {
        return ServiceResponse.failure("No category found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Category>("Category found", category);
    } catch (ex) {
      const errorMessage = `Error getting category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while getting category",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getCategoryUseCase = new GetCategoryUseCase();
