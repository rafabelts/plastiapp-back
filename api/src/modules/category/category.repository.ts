import db from "@/common/core/database";
import type { Pool } from "pg";
import { CreateCategory } from "./category.model";

export class CategoryRepository {
  private postgresDb: Pool;

  constructor(postgresDb: Pool = db) {
    this.postgresDb = postgresDb;
  }

  async getAll() {
    const { rows } = await this.postgresDb.query(
      `
SELECT
  product_category_id AS id, 
  name,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM
  product_category
WHERE
  deleted_at IS NULL
ORDER BY name ASC
`
    );

    return rows ?? null;
  }

  async getById(id: number) {
    const { rows } = await this.postgresDb.query(
      `
SELECT
  product_category_id AS id,
  name,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM
  product_category
WHERE
  product_category_id = $1
  AND deleted_at IS NULL
`, [id]
    );

    return rows[0] ?? null;
  }

  async create(payload: CreateCategory) {
    const { rows } = await this.postgresDb.query(
      `
INSERT INTO 
  product_category 
  (name) 
VALUES 
  ($1) 
RETURNING 
  product_category_id AS id, 
  name, 
  created_at AS "createdAt",
  updated_at AS "updatedAt"
      `, [payload.name]
    );

    return rows[0] ?? null
  }


  async update(id: number, payload: Partial<CreateCategory>) {
    const updates: Array<string> = [];
    const values: Array<unknown> = [];
    let paramIndex = 1;

    if (payload.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(payload.name)
    }

    if (payload.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(payload.description)
    }

    if (updates.length === 0) {
      return null;
    }

    updates.push(`updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')`);
    values.push(id);

    const { rows } = await this.postgresDb.query(
      `
UPDATE product_category
SET ${updates.join(', ')}
WHERE product_category_id = $${paramIndex}
  AND deleted_at IS NULL
RETURNING product_category_id
`, values
    );

    return await this.getById(rows[0].product_id);
  }



  async softDelete(id: number) {
    const { rows } = await this.postgresDb.query(
      `
UPDATE product_category
SET
  deleted_at = (NOW() AT TIME ZONE 'America/Mexico_City'),
  updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')
WHERE product_category_id = $1
  AND deleted_at IS NULL
RETURNING product_category_id AS id, deleted_at AS "deletedAt"
`, [id]
    );

    return rows[0] ?? null;
  }
}
