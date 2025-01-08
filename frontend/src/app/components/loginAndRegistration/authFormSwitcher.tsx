"use client";
import { useHeader } from "@/app/providers";
import { useState } from "react";
import RegisterForm from "./registerForm";
import LoginForm from "./loginFrom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import clsx from "clsx";

export default function AuthFormSwitcher() {
  const { isAuthFormOpen, setAuthFormOpen } = useHeader();
  const [authMode, setAuthMode] = useState("login");

  if (!isAuthFormOpen) return null;

  return (
    <>
      <div
        onClick={() => setAuthFormOpen(false)}
        className="fixed inset-0 bg-black opacity-50 cursor-pointer z-20 "
      />
      <div className="modal fixed z-30 left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-gray-50 px-6 pt-4 md:w-2/5 md:px-6">
        <button onClick={() => setAuthFormOpen(false)} className="text-right">
          <XMarkIcon className="w-6 absolute right-4 top-4" />
        </button>
        <div className="relative mt-2 px-6">
          <RadioGroup
            defaultValue="login"
            className="grid grid-cols-2 relative h-12 border-b border-gray-800"
            value={authMode}
            onValueChange={setAuthMode}
          >
            <div
              className="absolute h-full w-[30%] border-b-2 border-gray-800 transition-transform duration-200 ease-in-out"
              style={{
                transform: `translateX(${
                  authMode === "login" ? "0" : "calc(233%)"
                })`,
              }}
            />
            <div className="relative">
              <RadioGroupItem
                value="login"
                id="login"
                className="peer sr-only"
              />
              <label
                htmlFor="login"
                className={clsx(
                  "flex h-full w-full cursor-pointer items-center justify-start rounded-l-lg text-sm font-medium transition-colors",
                  {
                    "text-black": authMode === "login",
                    "text-gray-400": authMode !== "login",
                  }
                )}
              >
                SIGN IN
              </label>
            </div>
            <div className="relative">
              <RadioGroupItem
                value="register"
                id="register"
                className="peer sr-only"
              />
              <label
                htmlFor="register"
                className={clsx(
                  "flex h-full w-full cursor-pointer items-center justify-end rounded-r-lg text-sm font-medium transition-colors",
                  {
                    "text-black": authMode === "register", // Svart text om authMode är register
                    "text-gray-400": authMode !== "register", // Grå text annars
                  }
                )}
              >
                NEW CUSTOMER
              </label>
            </div>
          </RadioGroup>
        </div>
        {authMode === "register" && (
          <RegisterForm
            authMode={authMode}
            setAuthMode={setAuthMode}
          ></RegisterForm>
        )}

        {authMode === "login" && <LoginForm></LoginForm>}
      </div>
    </>
  );
}
