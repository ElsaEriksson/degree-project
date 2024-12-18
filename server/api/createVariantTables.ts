import { productVariants } from "./variantsPlaceholderData";
import pool from "../config/db";

const createVariantsTable = async (connection: any) => {
  await connection.query(`
          CREATE TABLE IF NOT EXISTS Variants (
            variant_id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            size VARCHAR(50) NOT NULL,      
            stock_quantity INT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
          );
        `);
  console.log("Variants table created successfully!");
};

const insertInitialVariants = async (connection: any) => {
  await Promise.all(
    productVariants.map(async (variant) => {
      const [existingVariant] = await connection.query(
        "SELECT * FROM Variants WHERE variant_id = ?",
        [variant.variant_id]
      );

      if (existingVariant.length === 0) {
        await connection.query(
          `INSERT INTO Variants (product_id, size, stock_quantity)
           VALUES (?, ?, ?);`,
          [variant.product_id, variant.size, variant.stock_quantity]
        );
        console.log(`Product ${variant.variant_id} inserted.`);
      } else {
        console.log(`Product ${variant.variant_id} already exists. Skipping.`);
      }
    })
  );
  console.log("Product insertion process completed!");
};

const createTablesForVariants = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    await createVariantsTable(connection);

    await insertInitialVariants(connection);
  } catch (error) {
    console.error("Error creating tables or inserting user:", error);
  } finally {
    if (connection) connection.release();
  }
};

export default createTablesForVariants;
