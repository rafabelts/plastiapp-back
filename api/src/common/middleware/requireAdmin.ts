import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User is not authenticated" });
  }

  if (user.type !== "admin") {
    return res
      .status(StatusCodes.FORBIDDEN) // más correcto que 401 aquí
      .json({ message: "User doesn't have authorization to perform this action" });
  }

  next();
}
