"use client";
import { OrderDataFromDatabase } from "@/app/models/Orders";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function Order({ order }: { order: OrderDataFromDatabase }) {
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);

  const toggleOrder = (orderId: number) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() => toggleOrder(order?.order_id)}
        >
          <div className="flex flex-col items-start">
            <span className="font-mono text-sm font-bold">
              Order #{order.order_id}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-mono font-bold mr-4">
              ${order.total_price}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                order.status === "delivered"
                  ? "bg-green-200 text-green-800"
                  : order.status === "shipped"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
            {openOrderId === order.order_id ? (
              <ChevronUp className="ml-2" />
            ) : (
              <ChevronDown className="ml-2" />
            )}
          </div>
        </div>
        {openOrderId === order.order_id && (
          <div className="p-4 bg-gray-50 border-t border-dashed">
            <div className="font-mono text-sm mb-4">
              <h3 className="font-bold mb-2">Items:</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <span>
                    {item.quantity}x {item.product_name} ({item.size})
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="font-mono text-sm mb-4">
              <h3 className="font-bold mb-2">Additional Charges:</h3>
              <div className="flex justify-between mb-1">
                <span>Shipping</span>
                <span>$5.00</span>
              </div>
            </div>
            <div className="font-mono text-sm">
              <h3 className="font-bold mb-2">Shipping Address:</h3>
              <p className="capitalize">
                {order.postal_code} {order.shipping_address}, {order.city}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
