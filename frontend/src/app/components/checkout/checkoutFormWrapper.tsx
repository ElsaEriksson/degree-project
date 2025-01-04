"use client";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { CartItems } from "@/app/models/Cart";
import { stripePayment } from "@/app/lib/actions";

const stripePromise = loadStripe(
  "pk_test_51PJeAX2LDDRd0nb94oPYuwNucVCMguiDxFVh7DKXG5L0Ny5cz7jGfGoDJRGDAVOJ9xyJODpCKvT6vPs9hrq1Fu1600JsmHuDmK"
);

export default function CheckoutFormWrapper({
  cartItems,
}: {
  cartItems: CartItems[];
}) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const clientSecret = await stripePayment(cartItems);
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchClientSecret();
  }, [cartItems]);

  const options = {
    clientSecret,
  };

  console.log(cartItems);
  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}
