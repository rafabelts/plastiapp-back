import { sign, verify, SignOptions } from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { env } from "@/common/utils/envConfig";
import { randomBytes } from "crypto";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { log } from "console";
import { hash } from "@/common/utils/hash";
import { validateHash } from "@/common/utils/validateHash";


class AuthService {
  private repo: AuthRepository;
  constructor(repo: AuthRepository = new AuthRepository()) {
    this.repo = repo;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.repo.findCredentials(email);
      if (!user) return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);

      const isValid = await validateHash(password, user["password"]);
      if (!isValid) return ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);

      const { id, name, type } = user;

      await this.repo.revokeUserTokens(id);

      const tokens = await this.generateTokenPair(id, type);

      return ServiceResponse.success("User authenticated", {
        id,
        name,
        type,
        ...tokens
      });

    } catch (ex) {
      const errorMessage = `Error finding user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred whileauthenticating.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async generateTokenPair(userId: number, type: string) {
    const accessToken = sign(
      { userId, type },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    );

    const refreshToken = sign(
      { userId, type, tokenType: 'refresh' },
      env.JWT_REFRESH_SECRET, // 
      { expiresIn: '7d' }
    );

    const tokenHash = await hash(refreshToken);

    await this.repo.saveRefreshToken(
      userId,
      tokenHash,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: number, type: string };

      const userTokens = await this.repo.findRefreshTokens(decoded.userId);
      if (!userTokens || userTokens.length === 0) {
        return ServiceResponse.failure("Invalid or expired refresh token", null, StatusCodes.UNAUTHORIZED);
      }

      let storedToken = null;
      for (const token of userTokens) {
        const isMatch = await validateHash(refreshToken, token.token_hash);
        if (isMatch) {
          storedToken = token;
          break;
        }
      }

      if (!storedToken || storedToken.revoked_at) {
        return ServiceResponse.failure(
          "Invalid or expired refresh token",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const accessToken = sign(
        { userId: decoded.userId, type: decoded.type },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }
      );

      return ServiceResponse.success("Token refreshed", { accessToken });
    } catch (ex) {
      const errorMessage = `Error refreshing token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while refreshing token.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async logout(userId: number) {
    try {
      await this.repo.revokeUserTokens(userId);
      return ServiceResponse.success("Logged out successfully", null);
    } catch (ex) {
      const errorMessage = `Error logging out ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while logging out.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const authService = new AuthService();
