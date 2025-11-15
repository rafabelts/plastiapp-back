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
  ut.name AS type
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

  /*
  // Soft delete de usuario
  async softDeleteUser(userId: number) {
    const { rows } = await this.postgresDb.query(
      `UPDATE "user" 
       SET 
         deleted_at = (NOW() AT TIME ZONE 'America/Mexico_City'),
         updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')
       WHERE user_id = $1 
         AND deleted_at IS NULL
       RETURNING user_id, deleted_at`,
      [userId]
    );
    return rows[0] ?? null;
  }

  // Actualizar usuario (establece updated_at)
  async updateUser(userId: number, payload: Partial<{
    name: string,
    email: string,
    password: string,
    birthDate: string,
    userTypeId: number
  }>) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (payload.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(payload.name);
    }
    if (payload.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(payload.email);
    }
    if (payload.password !== undefined) {
      updates.push(`password = $${paramIndex++}`);
      values.push(payload.password);
    }
    if (payload.birthDate !== undefined) {
      updates.push(`birth_date = $${paramIndex++}`);
      values.push(payload.birthDate);
    }
    if (payload.userTypeId !== undefined) {
      updates.push(`user_type_id = $${paramIndex++}`);
      values.push(payload.userTypeId);
    }

    if (updates.length === 0) {
      return null;
    }

    // Siempre actualizar updated_at
    updates.push(`updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')`);
    values.push(userId);

    const { rows } = await this.postgresDb.query(
      `UPDATE "user"
       SET ${updates.join(', ')}
       WHERE user_id = $${paramIndex}
         AND deleted_at IS NULL
       RETURNING 
         user_id, 
         name, 
         email, 
         birth_date, 
         user_type_id,
         created_at,
         updated_at`,
      values
    );

    return rows[0] ?? null;
  }*/
}
