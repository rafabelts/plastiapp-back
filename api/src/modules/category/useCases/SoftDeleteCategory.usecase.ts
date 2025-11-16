import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { CategoryRepository } from "../category.repository";

class SoftDeleteCategoryUseCase {
  private repo: CategoryRepository;
  constructor(repo: CategoryRepository = new CategoryRepository) {
    this.repo = repo;
  }

  async execute(id: number) {
    try {
      const deletedCategory = await this.repo.softDelete(id);

      if (!deletedCategory) {
        return ServiceResponse.failure("Category not found", null, StatusCodes.NOT_FOUND)
      }

      return ServiceResponse.success("Category deleted (soft)", deletedCategory);
    } catch (ex) {
      const errorMessage = `Error deleting category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while deleting category",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const softDeleteCategoryUseCase = new SoftDeleteCategoryUseCase();
