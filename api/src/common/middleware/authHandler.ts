
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, verify } from "jsonwebtoken";
import { env } from "../utils/envConfig";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        type: string;
      };
    }
  }
}

export function authenticateToken(req: Request,
  res: Response,
  next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      type: decoded.type
    };

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired access token'
    });
  }


}
