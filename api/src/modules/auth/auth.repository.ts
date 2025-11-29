import db from "@/common/core/database";
import type { Pool } from "pg";

export class AuthRepository {
  private postgresDb: Pool;

  constructor(postgresDb: Pool = db) {
    this.postgresDb = postgresDb;
  }

  async createUser(payload: {
    name: string,
    email: string,
    password: string,
    birthDate: string,
    userTypeId: number,
    createdById: number
  }) {
    const { rows } = await this.postgresDb.query(
      `
INSERT INTO "user" (
  name,
  email,
  password,
  birth_date,
  user_type_id,
  created_by_id
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING 
  user_id, 
  name, 
  email, 
  birth_date, 
  user_type_id, 
  created_by_id,
  created_at,
  updated_at
      `,
      [payload.name, payload.email, payload.password,
      payload.birthDate, payload.userTypeId, payload.createdById]
    );
    return rows[0] ?? null;
  }

  async findCredentials(email: string) {
    const query = `
SELECT
  u.user_id AS id,
  u.name,
  u.password,
  ut.name AS type,
  u.user_type_id AS "typeId"
FROM "user" AS u 
INNER JOIN user_type AS ut
  ON ut.user_type_id = u.user_type_id
WHERE
  u.email = $1
  AND u.deleted_at IS NULL
  AND ut.deleted_at IS NULL
    `;
    const values = [email];
    const { rows } = await this.postgresDb.query(query, values);
    return rows[0] ?? '';
  }

  async saveRefreshToken(userId: number, tokenHash: string, expiresAt: Date) {
    await this.postgresDb.query(
      `INSERT INTO refresh_token (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );
  }

  async findRefreshTokens(userId: number) {
    const { rows } = await this.postgresDb.query(
      `SELECT 
        rt.refresh_token_id,
        rt.user_id,
        rt.token_hash,
        rt.expires_at,
        rt.revoked_at,
        ut.name AS user_type
       FROM refresh_token rt
       INNER JOIN "user" u ON u.user_id = rt.user_id
       INNER JOIN user_type ut ON ut.user_type_id = u.user_type_id
       WHERE rt.user_id = $1
         AND rt.revoked_at IS NULL
         AND rt.expires_at > (NOW() AT TIME ZONE 'America/Mexico_City')
         AND u.deleted_at IS NULL
         AND ut.deleted_at IS NULL`,
      [userId]
    );
    return rows ?? null;
  }

  async revokeUserTokens(userId: number) {
    await this.postgresDb.query(
      `UPDATE refresh_token 
       SET revoked_at = (NOW() AT TIME ZONE 'America/Mexico_City')
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId]
    );
  }
}
