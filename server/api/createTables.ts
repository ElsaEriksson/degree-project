import { products } from "./productsPlaceholderData";
import { productVariants } from "./variantsPlaceholderData";
import pool from "../config/db";
import bcrypt from "bcrypt";

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
          is_favorite BOOLEAN DEFAULT FALSE,
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

const createUsersTable = async (connection: any) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS Users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  console.log("Users table created successfully!");
};

const insertInitialUser = async (connection: any) => {
  const hashedPassword = await bcrypt.hash("secure_password", 10);
  await connection.query(
    `INSERT INTO Users (first_name, last_name, email, password, role)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE user_id=user_id;`,
    ["John", "Doe", "john.doe@example.com", hashedPassword, "user"]
  );
  console.log("Initial user added successfully!");
};

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

const createCollectionsTable = async (connection: any) => {
  await connection.query(`
      CREATE TABLE IF NOT EXISTS Collections (
        collection_id INT AUTO_INCREMENT PRIMARY KEY,
        collection_name VARCHAR(255) NOT NULL UNIQUE,
        description_short VARCHAR(255) NOT NULL,
        description_long VARCHAR(355) NOT NULL
      );
    `);
  console.log("Collections table created successfully!");
};

const insertInitialCollections = async (connection: any) => {
  const collections = [
    [
      "Beigelace",
      "Understated elegance woven with intricate detail.",
      "Beigelace is a symphony of soft neutrals...",
    ],
    [
      "Colorfur",
      "A vivid expression of artistry in motion.",
      "Colorfur bursts with life, offering vibrant hues...",
    ],
    [
      "Howdy",
      "Where timeless Western charm meets couture elegance.",
      "Inspired by the rugged beauty of the frontier...",
    ],
  ];

  for (const collection of collections) {
    try {
      const [existingCollection] = await connection.query(
        `SELECT * FROM Collections WHERE collection_name = ?`,
        [collection[0]]
      );

      if (existingCollection.length > 0) {
        console.log(`Collection ${collection[0]} already exists.`);
      } else {
        const [result] = await connection.query(
          `INSERT INTO Collections (collection_name, description_short, description_long)
           VALUES (?, ?, ?)`,
          collection
        );
        console.log(
          `Collection ${collection[0]} added successfully with ID: ${result.insertId}`
        );
      }
    } catch (error: any) {
      console.error("Error inserting collection:", error.message);
    }
  }
};

const createCartsTable = async (connection: any) => {
  await connection.query(`
      CREATE TABLE IF NOT EXISTS Carts (
        cart_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
      );
    `);
  console.log("Carts table created successfully!");
};

const createCartItemsTable = async (connection: any) => {
  await connection.query(`
      CREATE TABLE IF NOT EXISTS CartItems (
        cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        variant_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES Carts(cart_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
        FOREIGN KEY (variant_id) REFERENCES Variants(variant_id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_variant (cart_id, variant_id)
      );
    `);
  console.log("CartItems table created successfully!");
};

const createOrdersTable = async (connection: any) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS Orders (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      guest_id VARCHAR(255) NULL,
      cart_id INT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      shipping_address VARCHAR(255) NOT NULL,
      postal_code VARCHAR(20) NOT NULL,
      city VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (cart_id) REFERENCES Carts(cart_id) ON DELETE CASCADE
    );
  `);
  console.log("Orders table with personal details created successfully!");
};

const createOrderItemsTable = async (connection: any) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS OrderItems (
      order_item_id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      variant_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES Variants(variant_id) ON DELETE CASCADE,
      UNIQUE KEY unique_order_variant (order_id, variant_id)
    );
  `);
  console.log("OrderItems table created successfully!");
};

const createTables = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    await createProductsTable(connection);
    await insertInitialProducts(connection);

    await createUsersTable(connection);
    await insertInitialUser(connection);

    await createVariantsTable(connection);
    await insertInitialVariants(connection);

    await createCollectionsTable(connection);
    await insertInitialCollections(connection);

    await createCartsTable(connection);
    await createCartItemsTable(connection);

    await createOrdersTable(connection);
    await createOrderItemsTable(connection);
  } catch (error) {
    console.error("Error creating tables or inserting user:", error);
  } finally {
    if (connection) connection.release();
  }
};

export default createTables;
