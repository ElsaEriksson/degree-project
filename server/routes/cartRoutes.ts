import { Router, Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { userId } = req.body; // userId kan vara null för gäster
  try {
    const [result] = await pool.query(
      "INSERT INTO Carts (user_id, created_at, status) VALUES (?, NOW(), 'active')",
      [userId]
    );

    const cartId = (result as any).insertId;
    res.status(201).json({ cartId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/active/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const [results] = await pool.query<RowDataPacket[]>(
      "SELECT cart_id FROM Carts WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (results.length > 0) {
      res.json(results[0]); // Returnera första träffen
    } else {
      res.status(404).json({ message: "No active cart found for this user" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/cart-items/:cartId/:variantId",
  async (req: Request, res: Response) => {
    const { cartId, variantId } = req.params;
    try {
      const [results] = await pool.query<RowDataPacket[]>(
        "SELECT cart_item_id, quantity FROM CartItems WHERE cart_id = ? AND variant_id = ?",
        [cartId, variantId]
      );

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: "Item not found in the cart" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch("/cart-items/:cartItemId", async (req: Request, res: Response) => {
  const { cartItemId } = req.params;
  const { newQuantity } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE CartItems SET quantity = ? WHERE cart_item_id = ?",
      [newQuantity, cartItemId]
    );

    if ((result as any).affectedRows > 0) {
      res.json({ message: "Cart item quantity updated successfully" });
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/cart-items", async (req: Request, res: Response) => {
  const { cartId, productId, variantId, quantity, price } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO CartItems (cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)",
      [cartId, productId, variantId, quantity, price]
    );

    const cartItemId = (result as any).insertId;
    res.status(201).json({ cartItemId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
