"use client";
import {
  ArrowRightIcon,
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { authenticate } from "@/app/lib/actions/auth";

export default function LoginForm() {
  const [errorMessage, loginFormAction, isPending2] = useActionState(
    authenticate,
    undefined
  );
  const path = usePathname();

  return (
    <>
      {/* Login form */}
      <form action={loginFormAction} className="space-y-3">
        <input
          type="text"
          className="hidden"
          defaultValue={path}
          name="path"
          id="path"
        />
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-4">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
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
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-3 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>

            <Button
              className="mt-6 w-full uppercase"
              aria-disabled={isPending2}
            >
              Sign in
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>

            <div className="flex h-8 items-end space-x-1">
              {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
