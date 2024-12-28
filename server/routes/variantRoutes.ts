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

router.get("/:variantId", async (req: Request, res: Response) => {
  const variant_id = Number(req.params.variantId);

  if (isNaN(variant_id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const [results] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Variants WHERE variant_id = ?",
      [variant_id]
    );

    const variant = results[0] as Variant;

    if (!variant) {
      res.status(404).json({ error: "Variant not found" });
      return;
    }

    res.json(variant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
