import { AuthRepository } from "@/modules/auth/auth.repository";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { PlasticRepository } from "../plastic.repository";
import { CreatePlastic, Plastic } from "../plastic.model";

class CreatePlasticUseCase {
  private repo: PlasticRepository;

  constructor(repo: PlasticRepository = new PlasticRepository) {
    this.repo = repo;
  }

  async execute(createdBy: number, payload: CreatePlastic) {
    try {
      const plastic = await this.repo.create(payload);

      return ServiceResponse.success("Category created", plastic);
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

export const createPlasticUseCase = new CreatePlasticUseCase();
