import { products } from "./productsPlaceholderData";
import pool from "../config/db";

const createProductsTable = async (connection: any) => {
  await connection.query(`
        CREATE TABLE IF NOT EXISTS Products (
          product_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,      
          main_image VARCHAR(455) NOT NULL,
          video VARCHAR(455) NOT NULL,
          additional_image VARCHAR(455) NOT NULL,
          collection_id INT NOT NULL,
          price INT NOT NULL,
          description_short VARCHAR(255) NOT NULL,
          description_long VARCHAR(355) NOT NULL,
          material VARCHAR(255) NOT NULL,
          gender VARCHAR(255) NOT NULL,
          season VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (collection_id) REFERENCES Collections(collection_id) ON DELETE CASCADE
        );
      `);
  console.log("Products table created successfully!");
};

const insertInitialProducts = async (connection: any) => {
  await Promise.all(
    products.map(async (product) => {
      const [existingProduct] = await connection.query(
        "SELECT * FROM Products WHERE name = ?",
        [product.name]
      );

      if (existingProduct.length === 0) {
        await connection.query(
          `INSERT INTO Products (name, main_image, video, additional_image, collection_id, price, description_short, description_long, material, gender, season)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            product.name,
            product.mainImage,
            product.video,
            product.additionalImage,
            product.collection_id,
            product.price,
            product.description_short,
            product.description_long,
            product.material,
            product.gender,
            product.season,
          ]
        );
        console.log(`Product ${product.name} inserted.`);
      } else {
        console.log(`Product ${product.name} already exists. Skipping.`);
      }
    })
  );
  console.log("Product insertion process completed!");
};

const createTablesForProducts = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    await createProductsTable(connection);

    await insertInitialProducts(connection);
  } catch (error) {
    console.error("Error creating tables or inserting user:", error);
  } finally {
    if (connection) connection.release();
  }
};

export default createTablesForProducts;
