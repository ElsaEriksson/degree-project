"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
const ITEMS_PER_PAGE = 12;
router.get("/variants-with-product-info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query.toLowerCase() || "";
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const [countResult] = yield db_1.default.query(`
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM Products p
      WHERE (? = '' OR p.name LIKE ? COLLATE utf8mb4_general_ci)`, [query, `%${query}%`]);
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    try {
        const [results] = yield db_1.default.query(`
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
      WHERE (? = '' OR p.name LIKE ? COLLATE utf8mb4_general_ci)      
      GROUP BY 
        p.product_id
      LIMIT ?
      OFFSET ?
    `, [query, `%${query}%`, ITEMS_PER_PAGE, offset]);
        const products = results.map((product) => ({
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
                ? product.variants.split(",").map((variant) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/favorite-variants-with-product-info", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const favoriteIds = (req.query.favoriteIds || "")
        .split(",")
        .filter(Boolean);
    let whereClause = "";
    let queryParams = [ITEMS_PER_PAGE, offset];
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
    const [countResult] = yield db_1.default.query(`
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM Products p
      ${whereClause}
    `, favoriteIds.length > 0 ? [favoriteIds] : []);
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    try {
        const [results] = yield db_1.default.query(`
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
      `, queryParams);
        const products = results.map((product) => ({
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
                ? product.variants.split(",").map((variant) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/product-with-variants/:productId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.params.productId);
    if (isNaN(productId)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
    }
    try {
        // Fetch the product with the given ID and its variants
        const [results] = yield db_1.default.query(`
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
      `, [productId]);
        // Check if product was found
        if (results.length === 0) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        // Map the product data with variants
        const product = results[0];
        const productWithVariants = {
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
                ? product.variants.split(",").map((variant) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/collection-product-with-variants/:collectionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionId = Number(req.params.collectionId);
    if (isNaN(collectionId)) {
        res.status(400).json({ error: "Invalid collection ID" });
        return;
    }
    try {
        // Fetch the product with the given ID and its variants
        const [results] = yield db_1.default.query(`
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
          p.collection_id = ?
        GROUP BY 
          p.product_id
      `, [collectionId]);
        // Check if product was found
        if (results.length === 0) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        const products = results.map((product) => ({
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
                ? product.variants.split(",").map((variant) => {
                    const [variant_id, size, stock_quantity] = variant.split(":");
                    return {
                        variant_id: parseInt(variant_id, 10),
                        size,
                        stock_quantity: parseInt(stock_quantity, 10),
                    };
                })
                : [],
        }));
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
