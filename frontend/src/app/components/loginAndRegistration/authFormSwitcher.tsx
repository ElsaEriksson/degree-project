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

  const activeIndicatorStyle = {
    transform: `translateX(${authMode === "login" ? "0" : "calc(233%)"})`,
  };

  const loginLabelClasses = clsx(
    "flex h-full w-full cursor-pointer items-center justify-start rounded-l-lg text-sm font-medium transition-colors",
    {
      "text-black": authMode === "login",
      "text-gray-400": authMode !== "login",
    }
  );

  const registerLabelClasses = clsx(
    "flex h-full w-full cursor-pointer items-center justify-end rounded-r-lg text-sm font-medium transition-colors",
    {
      "text-black": authMode === "register",
      "text-gray-400": authMode !== "register",
    }
  );

  return (
    <>
      <div
        onClick={() => setAuthFormOpen(false)}
        className="fixed inset-0 bg-black opacity-50 cursor-pointer z-20 "
      />

      <div className="modal fixed z-30 left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-gray-50 md:px-6 pt-4 w-4/5 md:w-3/5 lg:w-2/5">
        <button onClick={() => setAuthFormOpen(false)} className="text-right">
          <XMarkIcon className="w-6 absolute right-4 top-4" />
        </button>

        {/* RadioGroup to choose between "login" and "register" */}
        <div className="relative mt-2 px-6">
          <RadioGroup
            defaultValue="login"
            className="grid grid-cols-2 relative h-12 border-b border-gray-800"
            value={authMode}
            onValueChange={setAuthMode}
          >
            <div
              className="absolute h-full w-[30%] border-b-2 border-gray-800 transition-transform duration-200 ease-in-out"
              style={activeIndicatorStyle}
            />
            <div className="relative">
              <RadioGroupItem
                value="login"
                id="login"
                className="peer sr-only"
              />
              <label htmlFor="login" className={loginLabelClasses}>
                SIGN IN
              </label>
            </div>
            <div className="relative">
              <RadioGroupItem
                value="register"
                id="register"
                className="peer sr-only"
              />
              <label htmlFor="register" className={registerLabelClasses}>
                NEW CUSTOMER
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Render correct form based on chosen authMode */}
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
