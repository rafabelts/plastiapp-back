import { PlasticRepository } from "../plastic.repository";
import { CreatePlastic } from "../plastic.model";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

class UpdatePlasticUseCase {
  private repo: PlasticRepository;

  constructor(repo: PlasticRepository = new PlasticRepository) {
    this.repo = repo;
  }

  async execute(id: number, payload: Partial<CreatePlastic>) {
    try {
      const updatedPlastic = await this.repo.update(id, payload);
      return ServiceResponse.success("Plastic updated", updatedPlastic);
    } catch (ex) {
      const errorMessage = `Error updating plastic: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while updating plastic",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

  }
}

export const updatePlasticUseCase = new UpdatePlasticUseCase();
