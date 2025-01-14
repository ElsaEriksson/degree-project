import express, { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { Collection } from "../api/definitions";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [results] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Collections"
    );

    const collections: Collection[] = results as Collection[];

    res.json(collections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
