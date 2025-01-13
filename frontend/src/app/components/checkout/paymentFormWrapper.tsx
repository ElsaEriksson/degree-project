"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { CartItems } from "@/app/models/Cart";
import PaymentForm from "./paymentForm";
import { stripePayment } from "@/app/lib/actions/ordersAndPayment";

const stripePromise = loadStripe(
  "pk_test_51PJeAX2LDDRd0nb94oPYuwNucVCMguiDxFVh7DKXG5L0Ny5cz7jGfGoDJRGDAVOJ9xyJODpCKvT6vPs9hrq1Fu1600JsmHuDmK"
);

export default function PaymentFormWrapper({
  cartItems,
  totalPrice,
}: {
  cartItems: CartItems[];
  totalPrice: number;
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

  return (
    <>
      {/* Payment form section */}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm
            cartItems={cartItems}
            totalPrice={totalPrice}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </>
  );
}
