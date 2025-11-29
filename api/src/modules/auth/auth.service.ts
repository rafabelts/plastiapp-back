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
import { CreateUser } from "./auth.model";


class AuthService {
  private repo: AuthRepository;
  constructor(repo: AuthRepository = new AuthRepository()) {
    this.repo = repo;
  }

  async createUser(createdBy: number, payload: CreateUser) {
    try {
      const generatedPass = this.generatePassword(payload.name, payload.birthDate)
      const pass = await hash(generatedPass);

      const user = await this.repo.createUser(
        {
          name: payload.name,
          email: payload.email,
          password: pass,
          birthDate: payload.birthDate,
          userTypeId: payload.userTypeId,
          createdById: createdBy
        }
      )

      return ServiceResponse.success("User created", {
        id: user.user_id,
        name: user.name,
        email: user.email,
        password: generatedPass,
        birthDate: user.birth_date,
        userTypeId: user.user_type_id,
        createdById: user.created_by_id
      });
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error ocurred while creating user",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.repo.findCredentials(email);
      if (!user) return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);

      const isValid = await validateHash(password, user["password"]);
      if (!isValid) return ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);

      const { id, name, type, typeId } = user;

      await this.repo.revokeUserTokens(id);

      const tokens = await this.generateTokenPair(id, type, typeId);

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

  generatePassword(name: string, birthDate: string) {
    const normalizedName = this.normalizeName(name);
    const [_, month, day] = birthDate.split("-");

    const random = Math.floor(10 + Math.random() * 90);

    return `${normalizedName}${day}${month}!${random}`;
  }

  normalizeName(name: string) {
    const firstName = name.trim().split("")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }

  async generateTokenPair(userId: number, type: string, typeId: number) {
    const accessToken = sign(
      { userId, type, typeId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    );

    const refreshToken = sign(
      { userId, type, typeId, tokenType: 'refresh' },
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
      const decoded = verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: number, type: string, typeId: number };

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
        { userId: decoded.userId, type: decoded.type, typeId: decoded.typeId },
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
