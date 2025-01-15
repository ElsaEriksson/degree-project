import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";
import dotenv from "dotenv";
import { User } from "../api/definitions";
import { body, validationResult } from "express-validator";

dotenv.config();

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

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

    res.json({
      user_id: user.user_id,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
});

const registerValidation = [
  body("first_name")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name can only contain letters and spaces."),
  body("last_name")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Last name can only contain letters and spaces."),
  body("email").isEmail().withMessage("Invalid email format."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    ),
];

router.post(
  "/register",
  registerValidation,
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ success: false, message: errors.array()[0].msg });
        return;
      }

      const { first_name, last_name, email, password, role } = req.body;

      const [existingUser] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        res
          .status(400)
          .json({ success: false, message: "E-mail already exists." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query<ResultSetHeader>(
        `INSERT INTO Users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [first_name, last_name, email, hashedPassword, role || "user"]
      );

      res.status(201).json({
        success: true,
        message: "Registration successfull!",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
);

export default router;
