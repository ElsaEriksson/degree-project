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
    const { userId } = req.body; // userId kan vara null för gäster
    try {
        const [result] = yield db_1.default.query("INSERT INTO Carts (user_id, created_at, status) VALUES (?, NOW(), 'active')", [userId]);
        const cartId = result.insertId;
        res.status(201).json({ cartId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/active/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const [results] = yield db_1.default.query("SELECT cart_id FROM Carts WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1", [userId]);
        if (results.length > 0) {
            res.json(results[0]); // Returnera första träffen
        }
        else {
            res.status(404).json({ message: "No active cart found for this user" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/cart-items/:cartId/:variantId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, variantId } = req.params;
    try {
        const [results] = yield db_1.default.query("SELECT cart_item_id, quantity FROM CartItems WHERE cart_id = ? AND variant_id = ?", [cartId, variantId]);
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
    const { cartItemId } = req.params;
    const { newQuantity } = req.body;
    try {
        const [result] = yield db_1.default.query("UPDATE CartItems SET quantity = ? WHERE cart_item_id = ?", [newQuantity, cartItemId]);
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
    const { cartId, productId, variantId, quantity, price } = req.body;
    try {
        const [result] = yield db_1.default.query("INSERT INTO CartItems (cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)", [cartId, productId, variantId, quantity, price]);
        const cartItemId = result.insertId;
        res.status(201).json({ cartItemId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
