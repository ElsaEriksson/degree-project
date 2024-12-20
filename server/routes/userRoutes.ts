import express, { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// router.get("/", async (req: Request, res: Response) => {
//   try {
//       const [results] = await pool.query<RowDataPacket[]>(
//         "SELECT * FROM Users WHERE user_id = ?",
//         [req.userId]
//       );
//       const user = results[0] as User;
//       res.json(user);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/user", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = rows[0] as User;

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.json(user);
    return;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
});

// Add a new user
router.post("/", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role } = req.body;

  try {
    // Hasha lösenordet innan det lagras i databasen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kör frågan
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hashedPassword, role || "user"]
    );

    // Returnera det skapade objektet
    res.status(201).json({
      id: (result as any).insertId,
      first_name,
      last_name,
      email,
      role: role || "user",
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Email already exists." });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

export default router;
