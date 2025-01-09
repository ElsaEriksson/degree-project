"use client";
import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import { CartItems } from "@/app/models/Cart";
import { createOrderWithItems, updateCookieCart } from "@/app/lib/actions";
import { z } from "zod";
import { useRouter } from "next/navigation";

interface StripePaymentElementOptions {
  layout?: "tabs" | "accordion" | "auto";
}

const orderDataSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  shipping_address: z.string().min(1, "Shipping address is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  email: z.string().email("Invalid email address"),
});

export default function PaymentForm({
  cartItems,
  totalPrice,
  clientSecret,
}: {
  cartItems: CartItems[];
  totalPrice: number;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    shipping_address: "",
    postal_code: "",
    city: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const router = useRouter();
  const cartId = cartItems[0].cart_id;

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationResult = orderDataSchema.safeParse(formData);

    if (!validationResult.success) {
      setErrors(validationResult.error.issues);
      return;
    }

    setErrors([]);

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret
    );

    if (
      error &&
      (error.type === "card_error" || error.type === "validation_error")
    ) {
      setMessage(error.message || "An error occurred.");
    } else if (paymentIntent?.status === "succeeded") {
      const orderData = {
        total_price: totalPrice,
        ...formData,
      };

      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const result = await createOrderWithItems(orderData, orderItems, cartId);
      if (result.success) {
        setMessage(`Order created successfully! Order ID: ${result.orderId}`);
        const updateCart: CartItems[] = [];
        await updateCookieCart(updateCart);
        router.push(`/confirmation/${result.orderId}`);
      } else {
        setMessage(`Failed to create order: ${result.error}`);
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="uppercase pt-2 pb-2 text-xl tracking-wide	">
        Your Information
      </div>
      <CheckoutForm
        formData={formData}
        onChange={handleInputChange}
        errors={errors}
      />
      <div className="border border-1 mb-2 mt-6"></div>
      <div className="uppercase mt-6 text-xl tracking-wide">Payment</div>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="h-12 w-full bg-black text-white mt-5"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
    </form>
  );
}
