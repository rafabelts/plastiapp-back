import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { PlasticRepository } from "../plastic.repository";

class SoftDeletePlasticUseCase {
  private repo: PlasticRepository;
  constructor(repo: PlasticRepository = new PlasticRepository) {
    this.repo = repo;
  }

  async execute(id: number) {
    try {
      const deletedPlastic = await this.repo.softDelete(id);

      if (!deletedPlastic) {
        return ServiceResponse.failure("Plastic not found", null, StatusCodes.NOT_FOUND)
      }

      return ServiceResponse.success("Plastic deleted (soft)", deletedPlastic);
    } catch (ex) {
      const errorMessage = `Error deleting plastic: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while deleting plastic",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

  }
}

export const softDeletePlasticUseCase = new SoftDeletePlasticUseCase()
