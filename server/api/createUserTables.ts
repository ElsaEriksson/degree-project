import pool from "../config/db";
import bcrypt from "bcrypt";

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

const createTablesForUsers = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    await createUsersTable(connection);

    await insertInitialUser(connection);
  } catch (error) {
    console.error("Error creating tables or inserting user:", error);
  } finally {
    if (connection) connection.release();
  }
};

export default createTablesForUsers;
