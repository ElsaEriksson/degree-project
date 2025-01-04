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
const dotenv_1 = __importDefault(require("dotenv"));
const router = (0, express_1.Router)();
dotenv_1.default.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const calculateOrderAmount = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
        console.error("Items is null, undefined, or empty");
        return 0;
    }
    const totalAmount = items.reduce((acc, product) => {
        const price = typeof product.price === "string"
            ? parseFloat(product.price)
            : product.price;
        if (typeof price !== "number" || isNaN(price)) {
            console.error(`Invalid price for product: ${JSON.stringify(product)}`);
            return acc;
        }
        return acc + price * product.quantity;
    }, 0);
    return Math.round(totalAmount * 100);
};
router.post("/create-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "sek",
            payment_method: "pm_card_mastercard",
            description: "Someone bought something",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        console.log(paymentIntent);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ error: "Failed to create payment intent" });
    }
}));
exports.default = router;
