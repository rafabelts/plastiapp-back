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
product_id AS id,
name,
description,
price
FROM product
`
    );

    return rows ?? null;;
  }

  async getById(id: number) {
    const { rows } = await this.postgresDb.query(
      `
SELECT
product_id AS id,
name,
description,
price
FROM product
WHERE product_id = $1;
`, [id]
    );

    return rows[0] ?? null;;
  }


  async create(payload: CreateProduct) {
    const { rows } = await this.postgresDb.query(
      `INSERT INTO product (
name,
description,
price
)
VALUES (
$1,
$2,
$3
)
RETURNING product_id, name, description, price 
`,
      [payload.name, payload.description, payload.price]
    );

    return rows[0] ?? null
  }
}
