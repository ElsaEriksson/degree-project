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
        p.is_favorite,
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
        currentPage: page,
        totalPages,
        totalProducts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/favorite-variants-with-product-info",
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const favoriteIds = ((req.query.favoriteIds as string) || "")
      .split(",")
      .filter(Boolean);

    let whereClause = "";
    let queryParams: any[] = [ITEMS_PER_PAGE, offset];

    // Om favoriteIds är tom, returnera ett tomt resultat direkt
    if (favoriteIds.length === 0) {
      res.json({
        products: [],
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
      });
      return;
    }

    if (favoriteIds.length > 0) {
      whereClause = "WHERE p.product_id IN (?)";
      queryParams = [favoriteIds, ITEMS_PER_PAGE, offset];
    }

    // First, get the total count of products
    const [countResult] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM Products p
      ${whereClause}
    `,
      favoriteIds.length > 0 ? [favoriteIds] : []
    );

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
          p.is_favorite,
          p.created_at,
          p.updated_at,
          GROUP_CONCAT(CONCAT(v.variant_id, ':', v.size, ':', v.stock_quantity) SEPARATOR ',') AS variants
        FROM 
          Products p
        LEFT JOIN 
          Variants v ON p.product_id = v.product_id
        ${whereClause}
        GROUP BY 
          p.product_id
        LIMIT ?
        OFFSET ?
      `,
        queryParams
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
        currentPage: page,
        totalPages,
        totalProducts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/product-with-variants/:productId",
  async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    try {
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
        WHERE 
          p.product_id = ?
        GROUP BY 
          p.product_id
      `,
        [productId]
      );

      // Check if product was found
      if (results.length === 0) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      // Map the product data with variants
      const product = results[0];
      const productWithVariants: ProductWithVariants = {
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
      };

      res.json(productWithVariants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
