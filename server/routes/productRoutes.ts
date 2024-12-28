import express, { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { Product } from "../models/Product";

const router = express.Router();

interface ProductWithVariants extends Product {
  variants: { variant_id: number; size: string; stock_quantity: number }[];
}

const ITEMS_PER_PAGE = 12;

router.get(
  "/variants-with-product-info",
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // First, get the total count of products
    const [countResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM Products p
    `);
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    try {
      const [results] = await pool.query<RowDataPacket[]>(
        `
      SELECT 
        p.product_id,
        p.name,
        p.main_image,
        p.video,
        p.additional_image,
        p.collection_id,
        p.price,
        p.description_short,
        p.description_long,
        p.material,
        p.gender,
        p.season,
        p.created_at,
        p.updated_at,
        GROUP_CONCAT(CONCAT(v.variant_id, ':', v.size, ':', v.stock_quantity) SEPARATOR ',') AS variants
      FROM 
        Products p
      LEFT JOIN 
        Variants v ON p.product_id = v.product_id
      GROUP BY 
        p.product_id
      LIMIT ?
      OFFSET ?
    `,
        [ITEMS_PER_PAGE, offset]
      );

      const products: ProductWithVariants[] = results.map((product) => ({
        product_id: product.product_id,
        name: product.name,
        main_image: product.main_image,
        video: product.video,
        additional_image: product.additional_image,
        collection_id: product.collection_id,
        price: product.price,
        description_short: product.description_short,
        description_long: product.description_long,
        material: product.material,
        gender: product.gender,
        season: product.season,
        created_at: product.created_at,
        updated_at: product.updated_at,
        variants: product.variants
          ? product.variants.split(",").map((variant: string) => {
              const [variant_id, size, stock_quantity] = variant.split(":");
              return {
                variant_id: parseInt(variant_id, 10),
                size,
                stock_quantity: parseInt(stock_quantity, 10),
              };
            })
          : [],
      }));

      res.json({
        products,
        currentPage: page,
        totalPages,
        totalProducts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/product-pages", async (req: Request, res: Response) => {});

export default router;
