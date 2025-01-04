import { Router } from "express";
import { CartItems } from "../models/Cart";

const router = Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items: CartItems[] | null | undefined) => {
  if (!items) {
    console.error("Items is null or undefined");
    return 0;
  }

  const totalAmount = items.reduce(
    (acc: number, product: CartItems) => acc + product.price,
    0
  );
  return totalAmount * 100;
};

router.post("/create-payment-intent", async (req, res) => {
  const { items }: { items: CartItems[] } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sek",
    payment_method: "pm_card_mastercard",
    description: "Someone bought something",
  });

  console.log(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

export default router;
