import express, { Request, Response, NextFunction } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import pool from "../config/db";

const router = express.Router();

const userIdSchema = z.number().int().positive();
const cartIdSchema = z.number().int().positive();
const productIdSchema = z.number().int().positive();
const variantIdSchema = z.number().int().positive();
const quantitySchema = z.number().int().positive();
const priceSchema = z.number().positive();

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: "An unexpected error occurred" });
};

const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ success: false, message: error.errors[0].message });
      } else {
        next(error);
      }
    }
  };

router.post(
  "/create-cart",
  validate(z.object({ user_id: userIdSchema })),
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.body;

    try {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO Carts (user_id, created_at, status) VALUES (?, NOW(), 'active')",
        [user_id]
      );

      res.status(201).json({ cart_id: result.insertId });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/active-cart/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = Number(req.params.userId);

    try {
      userIdSchema.parse(user_id);

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
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user ID" });
      } else {
        next(error);
      }
    }
  }
);

router.get(
  "/cart-items/:cartId/:variantId",
  async (req: Request, res: Response, next: NextFunction) => {
    const cart_id = Number(req.params.cartId);
    const variant_id = Number(req.params.variantId);

    try {
      cartIdSchema.parse(cart_id);
      variantIdSchema.parse(variant_id);

      const [results] = await pool.query<RowDataPacket[]>(
        "SELECT cart_item_id, quantity FROM CartItems WHERE cart_id = ? AND variant_id = ?",
        [cart_id, variant_id]
      );

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: "Item not found in the cart" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        next(error);
      }
    }
  }
);

router.patch(
  "/cart-items/:cartItemId",
  validate(z.object({ quantity: quantitySchema })),
  async (req: Request, res: Response, next: NextFunction) => {
    const cart_item_id = Number(req.params.cartItemId);
    const { quantity } = req.body;

    try {
      z.number().int().positive().parse(cart_item_id);

      const [result] = await pool.query<ResultSetHeader>(
        "UPDATE CartItems SET quantity = ? WHERE cart_item_id = ?",
        [quantity, cart_item_id]
      );

      if (result.affectedRows > 0) {
        res.json({
          success: true,
          message: "Cart item quantity updated successfully",
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Cart item not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ success: false, message: "Invalid cart item ID" });
      } else {
        next(error);
      }
    }
  }
);

router.post(
  "/cart-items",
  validate(
    z.object({
      cart_id: cartIdSchema,
      product_id: productIdSchema,
      variant_id: variantIdSchema,
      quantity: quantitySchema,
      price: priceSchema,
    })
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { cart_id, product_id, variant_id, quantity, price } = req.body;

    try {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO CartItems (cart_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [cart_id, product_id, variant_id, quantity, price]
      );

      if (result.affectedRows > 0) {
        res
          .status(201)
          .json({ success: true, message: "Cart item created successfully" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Failed to insert cart item" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/cart-items-user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = Number(req.params.userId);

    try {
      userIdSchema.parse(user_id);

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
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid user ID" });
      } else {
        next(error);
      }
    }
  }
);

router.delete(
  "/cart-items/:cartItemId",
  async (req: Request, res: Response, next: NextFunction) => {
    const cart_item_id = Number(req.params.cartItemId);

    try {
      z.number().int().positive().parse(cart_item_id);

      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM CartItems WHERE cart_item_id = ?",
        [cart_item_id]
      );

      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ success: true, message: "Cart item deleted successfully" });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Cart item not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ success: false, message: "Invalid cart item ID" });
      } else {
        next(error);
      }
    }
  }
);

router.use(errorHandler);

export default router;
