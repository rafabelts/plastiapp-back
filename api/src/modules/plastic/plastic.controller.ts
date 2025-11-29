import type { Request, Response } from "express";
import { createPlasticUseCase } from "./useCases/CreatePlastic";
import { getPlasticsUseCase } from "./useCases/GetPlastics";
import { getPlasticUseCase } from "./useCases/GetPlastic";
import { updatePlasticUseCase } from "./useCases/UpdatePlastic.usecase";
import { softDeletePlasticUseCase } from "./useCases/SoftDeletePlastic.usecase";

class PlasticController {
  async create(req: Request, res: Response) {
    const {
      name,
      price
    } = req.body;

    const userId = req.user!.userId;

    const response = await createPlasticUseCase.execute(userId, { name, price });

    return res.status(response.statusCode).send(response);
  }

  async getAll(req: Request, res: Response) {
    const response = await getPlasticsUseCase.execute();
    return res.status(response.statusCode).send(response);
  }

  async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id as string, 10);

    const response = await getPlasticUseCase.execute(id);
    return res.status(response.statusCode).send(response);
  }

  async update(req: Request, res: Response) {
    const {
      name,
      price
    } = req.body;

    const id = Number.parseInt(req.params.id as string, 10);

    const response = await updatePlasticUseCase.execute(id, {
      name,
      price
    });
    return res.status(response.statusCode).send(response);
  }

  async softDelete(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id as string, 10);

    const response = await softDeletePlasticUseCase.execute(id);
    return res.status(response.statusCode).send(response);
  }


}

export const plasticController = new PlasticController();
