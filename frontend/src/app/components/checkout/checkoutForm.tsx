import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { MapPin, Phone } from "lucide-react";

export default function CheckoutForm() {
  return (
    <form action="">
      <label
        className="mb-3 mt-2 block text-xs font-medium text-gray-900"
        htmlFor="email"
      >
        Email
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="postalCode"
      >
        Postal code
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="postalCode"
          type="number"
          name="postalCode"
          placeholder="Enter your postal code"
          required
        />
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="address"
      >
        Address
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="address"
          type="text"
          name="address"
          placeholder="Enter your address"
          required
        />
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="city"
      >
        City
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="city"
          type="text"
          name="city"
          placeholder="Enter your city"
          required
        />
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="phoneNumber"
      >
        Phone number
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="phoneNumber"
          type="text"
          name="phoneNumber"
          placeholder="Enter your phone number"
          required
        />
        <Phone className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </form>
  );
}
