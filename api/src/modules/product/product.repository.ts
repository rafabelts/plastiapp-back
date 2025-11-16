import db from "@/common/core/database";
import { Pool } from "pg";
import { CreateProduct } from "@/modules/product/product.model";

export class ProductRepository {
  private postgresDb: Pool;

  constructor(postgresDb: Pool = db) {
    this.postgresDb = postgresDb;
  }

  async getAll() {
    const { rows } = await this.postgresDb.query(
      `
SELECT
  p.product_id AS id,
  p.name,
  p.description,
  p.price,
  pc.name AS category,
  p.created_at AS "createdAt",
  p.updated_at AS "updatedAt"
FROM product p
LEFT JOIN product_category pc ON p.category_id = pc.product_category_id
WHERE p.deleted_at IS NULL
  AND (pc.deleted_at IS NULL OR pc.product_category_id IS NULL)
ORDER BY p.created_at DESC
      `
    );
    return rows ?? null;
  }

  async getById(id: number) {
    const { rows } = await this.postgresDb.query(
      `
SELECT
  p.product_id AS id,
  p.name,
  p.description,
  p.price,
  pc.name AS category,
  p.created_at AS "createdAt", 
  p.updated_at AS "updatedAt"
FROM product p
LEFT JOIN product_category pc ON p.category_id = pc.product_category_id
WHERE p.product_id = $1
  AND p.deleted_at IS NULL
  AND (pc.deleted_at IS NULL OR pc.product_category_id IS NULL)
      `,
      [id]
    );
    return rows[0] ?? null;
  }

  async create(payload: CreateProduct) {
    const { rows } = await this.postgresDb.query(
      `INSERT INTO product (
  name,
  description,
  price,
  category_id
)
VALUES ($1, $2, $3, $4)
RETURNING 
  product_id AS id, 
  name, 
  description, 
  price,
  category_id,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
      `,
      [payload.name, payload.description, payload.price, payload.categoryId || null]
    );

    // if category, returns product with category name 
    if (rows[0] && rows[0].category_id) {
      return await this.getById(rows[0].product_id);
    }

    // else, returns category = null
    return {
      ...rows[0],
      category: null
    };
  }

  async update(id: number, payload: Partial<CreateProduct>) {
    const updates: Array<string> = [];
    const values: Array<unknown> = [];
    let paramIndex = 1;

    if (payload.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(payload.name);
    }

    if (payload.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(payload.description);
    }
    if (payload.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(payload.price);
    }
    if (payload.categoryId !== undefined) {
      updates.push(`category_id = $${paramIndex++}`);
      values.push(payload.categoryId);
    }

    if (updates.length === 0) {
      return null;
    }

    // update updated_at
    updates.push(`updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')`);
    values.push(id);

    const { rows } = await this.postgresDb.query(
      `UPDATE product
       SET ${updates.join(', ')}
       WHERE product_id = $${paramIndex}
         AND deleted_at IS NULL
       RETURNING product_id`,
      values
    );

    if (!rows[0]) {
      return null;
    }

    // return updated product
    return await this.getById(rows[0].product_id);
  }

  async softDelete(id: number) {
    const { rows } = await this.postgresDb.query(
      `
UPDATE product
SET
  deleted_at = (NOW() AT TIME ZONE 'America/Mexico_City'),
  updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')
WHERE product_id = $1
  AND deleted_at IS NULL
RETURNING product_id AS id, deleted_at AS "deletedAt"
`, [id]
    );

    return rows[0] ?? null;
  }

  /*
  // Obtener productos por categoría
  async getByCategoryId(categoryId: number) {
    const { rows } = await this.postgresDb.query(
      `
SELECT
  p.product_id AS id,
  p.name,
  p.description,
  p.price,
  pc.name AS category,
  p.created_at,
  p.updated_at
FROM product p
INNER JOIN product_category pc ON p.category_id = pc.product_category_id
WHERE p.category_id = $1
  AND p.deleted_at IS NULL
  AND pc.deleted_at IS NULL
ORDER BY p.created_at DESC
      `,
      [categoryId]
    );
    return rows ?? null;
  }
  */
}
