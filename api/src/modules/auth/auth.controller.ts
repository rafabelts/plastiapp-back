import type { Request, Response } from "express";
import { authService } from "@/modules/auth/auth.service";
import { env } from "@/common/utils/envConfig";
import { StatusCodes } from "http-status-codes";

class AuthController {
  async createUser(req: Request, res: Response) {
    const {
      name,
      email,
      birthDate,
      userTypeId
    } = req.body;
    const userId = req.user!.userId;

    const response = await authService.createUser(userId, { name, email, birthDate, userTypeId });
    return res.status(response.statusCode).send(response);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const response = await authService.login(email, password);

    // saves refresh token in cookies
    res.cookie('refreshToken', response.responseObject?.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(response.statusCode).send(response);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Refresh token required" });

    const response = await authService.refreshAccessToken(refreshToken);
    return res.status(response.statusCode).send(response);
  }

  async logout(req: Request, res: Response) {
    const userId = req.user!.userId;
    const response = await authService.logout(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? 'none' : 'lax'
    });

    return res.status(response.statusCode).send(response);
  }
}

export const authController = new AuthController();
