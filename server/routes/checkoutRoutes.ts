import { Request, Response, Router } from "express";
import { CartItems } from "../models/Cart";
import dotenv from "dotenv";

const router = Router();
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (
  items: CartItems[] | null | undefined
): number => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error("Items is null, undefined, or empty");
    return 0;
  }

  const totalAmount = items.reduce((acc: number, product: CartItems) => {
    const price =
      typeof product.price === "string"
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

router.post("/create-payment-intent", async (req: Request, res: Response) => {
  const { items } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
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
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: "Failed to create payment intent" });
  }
});

export default router;