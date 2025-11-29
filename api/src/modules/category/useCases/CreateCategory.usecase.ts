import { AuthRepository } from "@/modules/auth/auth.repository";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { CategoryRepository } from "../category.repository";
import { CreateCategory } from "../category.model";

class CreateCategoryUseCase {
  private repo: CategoryRepository;

  constructor(repo: CategoryRepository = new CategoryRepository) {
    this.repo = repo;
  }

  async execute(createdBy: number, payload: CreateCategory) {
    try {
      const category = await this.repo.create(payload);

      return ServiceResponse.success("Category created", category);
    } catch (ex) {
      const errorMessage = `Error creating category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while creating category",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export const createCategoryUseCase = new CreateCategoryUseCase();
