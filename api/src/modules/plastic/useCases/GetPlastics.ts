import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { PlasticRepository } from "../plastic.repository";
import { Plastic } from "../plastic.model";

class GetPlasticsUseCase {
  private repo: PlasticRepository;
  constructor(repo: PlasticRepository = new PlasticRepository()) {
    this.repo = repo;
  };

  async execute() {
    try {
      const plastics = await this.repo.getAll();

      if (!plastics || plastics.length === 0) {
        return ServiceResponse.failure("No plastics found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Array<Plastic>>("Plastics found", plastics);
    } catch (ex) {
      const errorMessage = `Error getting plastics: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while getting plastics",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getPlasticsUseCase = new GetPlasticsUseCase()
