import express, { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (req.userId) {
      // Registered user
      const [results] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Users WHERE user_id = ?",
        [req.userId]
      );
      const user = results[0] as User;
      res.json(user);
    } else if (req.guestId) {
      // Guest user
      res.json({ id: req.guestId, type: "guest" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
