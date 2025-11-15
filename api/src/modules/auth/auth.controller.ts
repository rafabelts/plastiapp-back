import type { Request, Response } from "express";
import { authService } from "@/modules/auth/auth.service";
import { env } from "@/common/utils/envConfig";
import { StatusCodes } from "http-status-codes";

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // saves refresh token in cookies
    res.cookie('refreshToken', result.responseObject?.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(result.statusCode).send(result);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Refresh token required" });

    const result = await authService.refreshAccessToken(refreshToken);
    return res.status(result.statusCode).send(result);
  }

  async logout(req: Request, res: Response) {
    const userId = req.user!.userId;
    const result = await authService.logout(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: 'strict'
    });

    return res.status(result.statusCode).send(result);
  }
}

export const authController = new AuthController();
