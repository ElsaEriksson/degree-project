import express, { Request, Response } from "express";
import pool from "../config/db";
import { ResultSetHeader } from "mysql2";

const router = express.Router();

router.post("/orders", async (req: Request, res: Response) => {
  const {
    user_id,
    guest_id,
    cart_id,
    total_price,
    first_name,
    last_name,
    phone_number,
    shipping_address,
    postal_code,
    city,
    email,
  } = req.body;

  try {
    const [orderResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO Orders (
        user_id,
        guest_id, 
        cart_id, 
        total_price, 
        first_name, 
        last_name, 
        phone_number, 
        shipping_address, 
        postal_code, 
        city,
        email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        user_id,
        guest_id,
        cart_id,
        total_price,
        first_name,
        last_name,
        phone_number,
        shipping_address,
        postal_code,
        city,
        email,
      ]
    );

    const orderId = orderResult.insertId;

    await pool.query(
      `UPDATE Carts SET status = 'completed' WHERE cart_id = ?`,
      [cart_id]
    );

    res.status(201).json({ message: "Order placed successfully!", orderId });
  } catch (error: any) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/order-items", async (req: Request, res: Response) => {
  const { order_id, items } = req.body;

  try {
    const values = items.map(
      ({ product_id, variant_id, quantity, price }: any) => [
        order_id,
        product_id,
        variant_id,
        quantity,
        price,
      ]
    );

    await pool.query(
      `INSERT INTO OrderItems (
          order_id, 
          product_id, 
          variant_id, 
          quantity, 
          price
        ) VALUES ?`,
      [values]
    );

    res.status(201).json({ message: "Order items added successfully!" });
  } catch (error: any) {
    console.error("Error adding order items:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
