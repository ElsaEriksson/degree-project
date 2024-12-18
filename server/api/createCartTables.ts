import pool from "../config/db";

const createCartsTable = async (connection: any) => {
  await connection.query(`
      CREATE TABLE IF NOT EXISTS Carts (
        cart_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        guest_id VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        INDEX idx_guest_id (guest_id)
      );
    `);
  console.log("Carts table created successfully!");
};

const createCartItemsTable = async (connection: any) => {
  await connection.query(`
      CREATE TABLE IF NOT EXISTS CartItems (
        cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        variant_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES Carts(cart_id) ON DELETE CASCADE,
        FOREIGN KEY (variant_id) REFERENCES Variants(variant_id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_variant (cart_id, variant_id)
      );
    `);
  console.log("CartItems table created successfully!");
};

const createTablesForCart = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    await createCartsTable(connection);
    await createCartItemsTable(connection);
  } catch (error) {
    console.error("Error creating cart tables:", error);
  } finally {
    if (connection) connection.release();
  }
};

export default createTablesForCart;
