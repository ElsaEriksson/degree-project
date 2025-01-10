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
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    try {
        const [result] = yield db_1.default.query("INSERT INTO Carts (user_id, created_at, status) VALUES (?, NOW(), 'active')", [user_id]);
        const cartId = result.insertId;
        res.status(201).json({ cart_id: cartId });
    }
    catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ error: "Failed to create cart" });
    }
}));
router.get("/active/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = Number(req.params.userId);
    if (isNaN(user_id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    try {
        const [results] = yield db_1.default.query("SELECT cart_id FROM Carts WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1", [user_id]);
        if (results.length > 0) {
            res.json(results[0]);
        }
        else {
            const [newCart] = yield db_1.default.query("INSERT INTO Carts (user_id, status) VALUES (?, 'active')", [user_id]);
            res.json({ cart_id: newCart.insertId });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/cart-items/:cartId/:variantId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart_id = Number(req.params.cartId);
    const variant_id = Number(req.params.variantId);
    if (isNaN(cart_id)) {
        res.status(400).json({ error: "Invalid cart ID" });
        return;
    }
    if (isNaN(variant_id)) {
        res.status(400).json({ error: "Invalid variant ID" });
        return;
    }
    try {
        const [results] = yield db_1.default.query("SELECT cart_item_id, quantity FROM CartItems WHERE cart_id = ? AND variant_id = ?", [cart_id, variant_id]);
        if (results.length > 0) {
            res.json(results[0]);
        }
        else {
            res.status(404).json({ message: "Item not found in the cart" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.patch("/cart-items/:cartItemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart_item_id = Number(req.params.cartItemId);
    const { quantity } = req.body;
    if (isNaN(cart_item_id)) {
        res.status(400).json({ error: "Invalid cart item ID" });
        return;
    }
    try {
        const [result] = yield db_1.default.query("UPDATE CartItems SET quantity = ? WHERE cart_item_id = ?", [quantity, cart_item_id]);
        if (result.affectedRows > 0) {
            res.json({ message: "Cart item quantity updated successfully" });
        }
        else {
            res.status(404).json({ message: "Cart item not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.post("/cart-items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart_id, product_id, variant_id, quantity, price } = req.body;
    try {
        const [result] = yield db_1.default.query("INSERT INTO CartItems (cart_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)", [cart_id, product_id, variant_id, quantity, price]);
        const cartItemId = result.insertId;
        res.status(201).json({ cartItemId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/cart-items/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = Number(req.params.userId);
    if (isNaN(user_id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    try {
        const [rows] = yield db_1.default.query(`
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
      `, [user_id, user_id]);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error fetching active cart items:", error);
        res.status(500).json({ error: "Failed to fetch active cart items" });
    }
}));
router.delete("/cart-items/:cartItemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart_item_id = Number(req.params.cartItemId);
    if (isNaN(cart_item_id)) {
        res.status(400).json({ error: "Invalid cart item ID" });
        return;
    }
    try {
        const [result] = yield db_1.default.query("DELETE FROM CartItems WHERE cart_item_id = ?", [cart_item_id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Cart item not found" });
            return;
        }
        res.status(200).json({ message: "Cart item deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ error: "Failed to delete cart item" });
    }
}));
exports.default = router;
