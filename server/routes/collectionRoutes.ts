import express, { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { Collection, ProductWithVariants } from "../models/Product";

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

router.get(
  "/collection-product-with-variants/:collectionName",
  async (req: Request, res: Response) => {
    const collectionName = req.params.collectionName;
    const query = (req.query.query as string) || "";

    if (!collectionName) {
      res.status(400).json({ error: "Invalid collection name" });
      return;
    }

    try {
      // Get total number of matching products
      const [countResult] = await pool.query<RowDataPacket[]>(
        `
              SELECT COUNT(DISTINCT p.product_id) as total
              FROM Products p
              LEFT JOIN Collections c ON p.collection_id = c.collection_id
              WHERE 
                c.collection_name = ?
              AND (? = '' OR p.name LIKE ? COLLATE utf8mb4_general_ci)
              `,
        [collectionName, query, `%${query}%`]
      );

      const totalProducts = countResult[0]?.total || 0;

      if (totalProducts === 0) {
        res.json({
          products: [],
          totalProducts: 0,
        });
        return;
      }
      // Fetch the product with the given ID and its variants
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
          p.is_favorite,
          p.created_at,
          p.updated_at,
          GROUP_CONCAT(CONCAT(v.variant_id, ':', v.size, ':', v.stock_quantity) SEPARATOR ',') AS variants
        FROM 
          Products p
        LEFT JOIN 
          Variants v ON p.product_id = v.product_id
        LEFT JOIN 
          Collections c ON p.collection_id = c.collection_id
        WHERE 
        c.collection_name = ?
        AND (? = '' OR p.name LIKE ? COLLATE utf8mb4_general_ci)    
        GROUP BY 
          p.product_id
      `,
        [collectionName, query, `%${query}%`]
      );

      // Check if product was found
      if (results.length === 0) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

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
        is_favorite: product.is_favorite,
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
        totalProducts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
