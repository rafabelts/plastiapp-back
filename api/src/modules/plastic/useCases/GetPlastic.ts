import { logger } from "@/server";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { PlasticRepository } from "../plastic.repository";
import { Plastic } from "../plastic.model";

class GetPlasticUseCase {
  private repo: PlasticRepository;
  constructor(repo: PlasticRepository = new PlasticRepository()) {
    this.repo = repo;
  };

  async execute(id: number) {
    try {
      const plastic = await this.repo.getById(id);

      if (!plastic || plastic.length === 0) {
        return ServiceResponse.failure("No plastic found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Plastic>("Plastic found", plastic);

    } catch (ex) {
      const errorMessage = `Error getting plastic: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while getting plastic",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getPlasticUseCase = new GetPlasticUseCase()
