import express, { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { ModestUser } from "../models/User";

const router = express.Router();

router.get("/user/:sessionId", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email FROM users WHERE user_id = ?",
      [sessionId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = rows[0] as ModestUser;

    res.json(user);
    return;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
});

// router.post("/", async (req: Request, res: Response) => {
//   const { first_name, last_name, email, password, role } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await pool.query<ResultSetHeader>(
//       `INSERT INTO Users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
//       [first_name, last_name, email, hashedPassword, role || "user"]
//     );

//     res.status(201).json({
//       id: (result as any).insertId,
//       first_name,
//       last_name,
//       email,
//       role: role || "user",
//     });
//   } catch (error: any) {
//     if (error.code === "ER_DUP_ENTRY") {
//       res.status(400).json({ error: "Email already exists." });
//     } else {
//       res.status(500).json({ error: error.message });
//     }
//   }
// });

export default router;
