"use client";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { MapPin, Phone, UserIcon } from "lucide-react";
import { z } from "zod";

interface CheckoutFormProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    shipping_address: string;
    postal_code: string;
    city: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: z.ZodIssue[];
}

export default function CheckoutForm({
  formData,
  onChange,
  errors,
}: CheckoutFormProps) {
  const getError = (field: string) => {
    return errors.find((error) => error.path[0] === field)?.message;
  };

  const iconClasses =
    "pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900";
  const inputBaseClasses =
    "peer block w-full rounded-md border py-[9px] text-sm outline-2 placeholder:text-gray-500 pl-10";

  return (
    <div>
      <label
        className="mb-3 mt-2 block text-xs font-medium text-gray-900"
        htmlFor="email"
      >
        Email
      </label>
      <div className="relative">
        <input
          className={`${inputBaseClasses} ${
            getError("email") ? "border-red-500" : "border-gray-200"
          }`}
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          value={formData.email}
          onChange={onChange}
        />
        <AtSymbolIcon className={iconClasses} />
      </div>

      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="postal_code"
      >
        Postal code
      </label>
      <div className="relative">
        <input
          className={`${inputBaseClasses} ${
            getError("postal_code") ? "border-red-500" : "border-gray-200"
          }`}
          id="postal_code"
          type="text"
          name="postal_code"
          placeholder="Enter your postal code"
          required
          value={formData.postal_code}
          onChange={onChange}
        />
        <MapPin className={iconClasses} />
      </div>

      <div className="flex gap-5">
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="first_name"
          >
            First name
          </label>
          <div className="relative">
            <input
              className={`${inputBaseClasses} ${
                getError("first_name") ? "border-red-500" : "border-gray-200"
              }`}
              id="first_name"
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              required
              value={formData.first_name}
              onChange={onChange}
            />
            <UserIcon className={iconClasses} />
          </div>
        </div>
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="last_name"
          >
            Last name
          </label>
          <div className="relative">
            <input
              className={`${inputBaseClasses} ${
                getError("last_name") ? "border-red-500" : "border-gray-200"
              }`}
              id="last_name"
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              required
              value={formData.last_name}
              onChange={onChange}
            />
            <UserIcon className={iconClasses} />
          </div>
        </div>
      </div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="shipping_address"
      >
        Shipping address
      </label>
      <div className="relative">
        <input
          className={`${inputBaseClasses} ${
            getError("shipping_address") ? "border-red-500" : "border-gray-200"
          }`}
          id="shipping_address"
          type="text"
          name="shipping_address"
          placeholder="Enter your shipping address"
          required
          value={formData.shipping_address}
          onChange={onChange}
        />
        <MapPin className={iconClasses} />
      </div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="city"
      >
        City
      </label>
      <div className="relative">
        <input
          className={`${inputBaseClasses} ${
            getError("city") ? "border-red-500" : "border-gray-200"
          }`}
          id="city"
          type="text"
          name="city"
          placeholder="Enter your city"
          required
          value={formData.city}
          onChange={onChange}
        />
        <MapPin className={iconClasses} />
      </div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="phone_number"
      >
        Phone number
      </label>
      <div className="relative">
        <input
          className={`${inputBaseClasses} ${
            getError("phone_number") ? "border-red-500" : "border-gray-200"
          }`}
          id="phone_number"
          type="text"
          name="phone_number"
          placeholder="Enter your phone number"
          required
          value={formData.phone_number}
          onChange={onChange}
        />
        <Phone className={iconClasses} />
      </div>
    </div>
  );
}
