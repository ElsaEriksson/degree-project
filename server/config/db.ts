import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.message);
//     process.exit(1);
//   }
//   console.log("Connected to MySQL database");
// });

export default pool;
