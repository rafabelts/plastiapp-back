import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { CategoryRepository } from "../category.repository";
import { CreateCategory } from "../category.model";

class UpdateCategoryUseCase {
  private repo: CategoryRepository;

  constructor(repo: CategoryRepository = new CategoryRepository()) {
    this.repo = repo;
  }

  async execute(id: number, payload: Partial<CreateCategory>) {
    try {
      const updatedCategory = await this.repo.update(id, payload);
      return ServiceResponse.success("Category updated", updatedCategory);
    } catch (ex) {
      const errorMessage = `Error updating category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while updating category",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const updateCategoryUseCase = new UpdateCategoryUseCase();
