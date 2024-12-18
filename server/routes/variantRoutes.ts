import express, { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { Variant } from "../models/Product";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [results] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Variants"
    );

    const variants: Variant[] = results as Variant[];

    res.json(variants);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
