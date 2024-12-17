import express, { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";
import { User } from "../models/User";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [results] = await pool.query<RowDataPacket[]>("SELECT * FROM Users");

    const users: User[] = results as User[];

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new user
router.post("/", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role } = req.body;

  // Kontrollera att alla nödvändiga fält finns
  // if (!first_name || !last_name || !email || !password) {
  //   return res.status(400).json({ error: "All fields are required." });
  // }

  // Validera förnamn och efternamn
  // if (first_name.length < 2 || last_name.length < 2) {
  //   return res.status(400).json({ error: "First name and last name must be at least 2 characters long." });
  // }

  // const nameRegex = /^[A-Za-z\s]+$/;
  // if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
  //   return res.status(400).json({ error: "First name and last name can only contain letters and spaces." });
  // }

  // // Validera e-postadress
  // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({ error: "Invalid email format." });
  // }

  // // Kontrollera om e-postadressen redan finns
  // const [existingUser] = await pool.query<RowDataPacket[]>("SELECT * FROM Users WHERE email = ?", [email]);
  // if (existingUser.length > 0) {
  //   return res.status(400).json({ error: "Email already exists." });
  // }

  // // Validera lösenord
  // if (password.length < 8) {
  //   return res.status(400).json({ error: "Password must be at least 8 characters long." });
  // }

  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({ error: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character." });
  // }

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
