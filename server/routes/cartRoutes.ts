import express, { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

const router = express.Router();

router.post("/create-cart", async (req: Request, res: Response) => {
  const { user_id } = req.body;

  if (isNaN(user_id)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Carts (user_id, created_at, status) VALUES (?, NOW(), 'active')",
      [user_id]
    );

    const cartId = result.insertId;

    res.status(201).json({ cart_id: cartId });
  } catch (error: any) {
    console.error(`Error creating cart for user_id ${user_id}:`, error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

router.get("/active-cart/:userId", async (req: Request, res: Response) => {
  const user_id = Number(req.params.userId);

  if (isNaN(user_id)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const [results] = await pool.query<RowDataPacket[]>(
      "SELECT cart_id FROM Carts WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1",
      [user_id]
    );

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      const [newCart] = await pool.query<ResultSetHeader>(
        "INSERT INTO Carts (user_id, status) VALUES (?, 'active')",
        [user_id]
      );
      res.json({ cart_id: newCart.insertId });
    }
  } catch (error: any) {
    console.error("Error fetching active cart:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

router.get(
  "/cart-items/:cartId/:variantId",
  async (req: Request, res: Response) => {
    const cart_id = Number(req.params.cartId);
    const variant_id = Number(req.params.variantId);

    if (isNaN(cart_id)) {
      res.status(400).json({ message: "Invalid cart ID" });
      return;
    }

    if (isNaN(variant_id)) {
      res.status(400).json({ message: "Invalid variant ID" });
      return;
    }

    try {
      const [results] = await pool.query<RowDataPacket[]>(
        "SELECT cart_item_id, quantity FROM CartItems WHERE cart_id = ? AND variant_id = ?",
        [cart_id, variant_id]
      );

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: "Item not found in the cart" });
      }
    } catch (error: any) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({
        error: "An unexpected error occurred. Please try again later.",
      });
    }
  }
);

router.patch("/cart-items/:cartItemId", async (req: Request, res: Response) => {
  const cart_item_id = Number(req.params.cartItemId);
  const { quantity } = req.body;

  if (isNaN(cart_item_id)) {
    res.status(400).json({ success: false, message: "Invalid cart item ID" });
    return;
  }

  if (typeof quantity !== "number" || quantity < 1) {
    res.status(400).json({ success: false, message: "Invalid quantity" });
    return;
  }

  try {
    const [result] = await pool.query(
      "UPDATE CartItems SET quantity = ? WHERE cart_item_id = ?",
      [quantity, cart_item_id]
    );

    const affectedRows = (result as RowDataPacket).affectedRows;

    if (affectedRows > 0) {
      res.json({
        success: true,
        message: "Cart item quantity updated successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Cart item not found" });
    }
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error);
    res
      .status(500)
      .json({ success: false, error: "An unexpected error occurred." });
  }
});

router.post("/cart-items", async (req: Request, res: Response) => {
  const { cart_id, product_id, variant_id, quantity, price } = req.body;

  if (isNaN(cart_id)) {
    res.status(400).json({ success: false, message: "Invalid cart ID" });
    return;
  }

  if (isNaN(product_id)) {
    res.status(400).json({ success: false, message: "Invalid product ID" });
    return;
  }

  if (isNaN(variant_id)) {
    res.status(400).json({ success: false, message: "Invalid variant ID" });
    return;
  }

  if (typeof quantity !== "number" || quantity < 1) {
    res.status(400).json({ success: false, message: "Invalid quantity" });
    return;
  }

  if (typeof price !== "number" || price <= 0) {
    res.status(400).json({ success: false, message: "Invalid price" });
    return;
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO CartItems (cart_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
      [cart_id, product_id, variant_id, quantity, price]
    );

    const affectedRows = (result as RowDataPacket).affectedRows;

    if (affectedRows > 0) {
      res.status(201).json({
        success: true,
        message: "Cart item created successfully",
      });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Failed to insert cart item" });
    }
  } catch (error: any) {
    console.error(`Error inserting cart item for cart_id ${cart_id}:`, error);
    res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred." });
  }
});

router.get("/cart-items-user/:userId", async (req: Request, res: Response) => {
  const user_id = Number(req.params.userId);

  if (isNaN(user_id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT 
          ci.cart_item_id,
          ci.cart_id,
          ci.product_id,
          ci.variant_id,
          ci.quantity,
          ci.price,
          v.size,
          v.stock_quantity,
          p.name,
          p.main_image
      FROM 
          CartItems ci
      JOIN 
          Carts c ON ci.cart_id = c.cart_id
      JOIN 
          Variants v ON ci.variant_id = v.variant_id
      JOIN 
          Products p ON ci.product_id = p.product_id    
      WHERE 
          c.user_id = ? 
          AND c.status = 'active'
          AND c.cart_id = (
              SELECT cart_id
              FROM Carts
              WHERE user_id = ?
              AND status = 'active'
              ORDER BY created_at DESC
              LIMIT 1
          )
      `,
      [user_id, user_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(`Error fetching cart items for cart_id ${user_id}:`, error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

router.delete(
  "/cart-items/:cartItemId",
  async (req: Request, res: Response) => {
    const cart_item_id = Number(req.params.cartItemId);

    if (isNaN(cart_item_id)) {
      res.status(400).json({ message: "Invalid cart item ID" });
      return;
    }

    try {
      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM CartItems WHERE cart_item_id = ?",
        [cart_item_id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }

      res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
);

export default router;
