import express, { Request, Response } from "express";
import pool from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { OrderData, OrderItem } from "../api/definitions";

const router = express.Router();

router.post("/order", async (req: Request, res: Response) => {
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
      ({ product_id, variant_id, quantity, price }: OrderItem) => [
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

router.get("/orders/:userId", async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const [results] = await pool.query<RowDataPacket[]>(
      `
      SELECT 
        o.order_id,
        o.user_id,
        o.total_price,
        o.first_name,
        o.last_name,
        o.shipping_address,
        o.postal_code,
        o.city,
        o.order_status,
        o.created_at,
        p.name,
        v.size,
        oi.quantity,
        oi.price
      FROM 
        Orders o
      JOIN 
        OrderItems oi ON o.order_id = oi.order_id
      JOIN
        Products p ON oi.product_id = p.product_id
      JOIN
        Variants v ON oi.variant_id = v.variant_id
      WHERE 
        o.user_id = ?
    `,
      [userId]
    );

    if (results.length === 0) {
      res.json([]);
      return;
    }

    const ordersMap = new Map<number, OrderData>();

    results.forEach((row) => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          order_id: row.order_id,
          user_id: row.user_id,
          guest_id: row.guest_id,
          total_price: row.total_price,
          first_name: row.first_name,
          last_name: row.last_name,
          shipping_address: row.shipping_address,
          postal_code: row.postal_code,
          city: row.city,
          status: row.order_status,
          created_at: row.created_at,
          items: [],
        });
      }

      const order = ordersMap.get(row.order_id)!;
      order.items.push({
        product_name: row.name,
        size: row.size,
        quantity: row.quantity,
        price: row.price,
      });
    });

    const ordersList: OrderData[] = Array.from(ordersMap.values());

    res.json(ordersList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/order/:orderId", async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId);

  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  try {
    const [results] = await pool.query<RowDataPacket[]>(
      `
      SELECT 
        o.order_id,
        o.user_id,
        o.guest_id,
        o.total_price,
        o.first_name,
        o.last_name,
        o.shipping_address,
        o.postal_code,
        o.city,
        o.created_at,
        p.name,
        v.size,
        oi.quantity,
        oi.price
      FROM 
        Orders o
      JOIN 
        OrderItems oi ON o.order_id = oi.order_id
      JOIN
        Products p ON oi.product_id = p.product_id
      JOIN
        Variants v ON oi.variant_id = v.variant_id
      WHERE 
        o.order_id = ?
    `,
      [orderId]
    );

    if (results.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const orderWithExtraData: OrderData = {
      order_id: results[0].order_id,
      user_id: results[0].user_id,
      guest_id: results[0].guest_id,
      total_price: results[0].total_price,
      first_name: results[0].first_name,
      last_name: results[0].last_name,
      shipping_address: results[0].shipping_address,
      postal_code: results[0].postal_code,
      city: results[0].city,
      created_at: results[0].created_at,
      items: results.map((item) => ({
        product_name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    res.json(orderWithExtraData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
