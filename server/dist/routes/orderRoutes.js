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
router.post("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, guest_id, cart_id, total_price, first_name, last_name, phone_number, shipping_address, postal_code, city, email, } = req.body;
    try {
        const [orderResult] = yield db_1.default.query(`INSERT INTO Orders (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`, [
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
        ]);
        const orderId = orderResult.insertId;
        yield db_1.default.query(`UPDATE Carts SET status = 'completed' WHERE cart_id = ?`, [cart_id]);
        res.status(201).json({ message: "Order placed successfully!", orderId });
    }
    catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: error.message });
    }
}));
router.post("/order-items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id, items } = req.body;
    try {
        const values = items.map(({ product_id, variant_id, quantity, price }) => [
            order_id,
            product_id,
            variant_id,
            quantity,
            price,
        ]);
        yield db_1.default.query(`INSERT INTO OrderItems (
          order_id, 
          product_id, 
          variant_id, 
          quantity, 
          price
        ) VALUES ?`, [values]);
        res.status(201).json({ message: "Order items added successfully!" });
    }
    catch (error) {
        console.error("Error adding order items:", error);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
