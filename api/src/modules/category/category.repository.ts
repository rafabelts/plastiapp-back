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
  name AS category,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM
  product_category
WHERE
  deleted_at IS NULL
`
    );

    return rows ?? null;
  }

  async getById(id: number) {
    const { rows } = await this.postgresDb.query(
      `
SELECT
product_category_id AS id
  name AS category,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM
  product_category
WHERE
  product_category_id = $1
  AND deleted_at IS NULL
ORDER BY p.created_at DESC
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
  product_category_id, 
  name, 
  created_at AS "createdAt",
  updated_at AS "updatedAt"
      `, [payload.name]
    );

    return rows[0] ?? null
  }
}
