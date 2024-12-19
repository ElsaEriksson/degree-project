import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../models/User";
import pool from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [results] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = results[0] as User;

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ user, token });
  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    if (first_name.length < 2 || last_name.length < 2) {
      res.status(400).json({
        error: "First name and last name must be at least 2 characters long.",
      });
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
      res.status(400).json({
        error: "First name and last name can only contain letters and spaces.",
      });
      return;
    }

    // Validera e-postadress
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format." });
      return;
    }

    // Kontrollera om e-postadressen redan finns
    const [existingUser] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    // Validera lösenord
    if (password.length < 8) {
      res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
      return;
    }

    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   res.status(400).json({
    //     error:
    //       "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    //   });
    //   return;
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hashedPassword, role || "user"]
    );

    const newUserId = (result as any).insertId;

    // Generate token for the new user
    const token = jwt.sign(
      { id: newUserId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      id: newUserId,
      first_name,
      last_name,
      email,
      role: role || "user",
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

export default router;
