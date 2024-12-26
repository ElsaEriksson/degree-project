"use client";

import { useState } from "react";
import LoginForm from "./loginFrom";
import RegisterForm from "./registerForm";
import { useHeader } from "../providers";

export default function AuthFormSwitcher() {
  const { isAuthFormOpen, setAuthFormOpen } = useHeader();
  const [authMode, setAuthMode] = useState("login");

  if (!isAuthFormOpen) return null;

  const handleAuthModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthMode(event.target.value);
  };

  return (
    <>
      <div
        onClick={() => setAuthFormOpen(false)}
        className="fixed inset-0 bg-black opacity-50 cursor-pointer z-20 "
      />
      <div className="modal absolute z-30 left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
        <div className="modal-content mb-4">
          <button onClick={() => setAuthFormOpen(false)}>Stäng</button>

          <label className="mr-4">
            <input
              type="radio"
              name="authMode"
              value="login"
              checked={authMode === "login"}
              onChange={handleAuthModeChange}
            />
            Log in
          </label>
          <label>
            <input
              type="radio"
              name="authMode"
              value="register"
              checked={authMode === "register"}
              onChange={handleAuthModeChange}
            />
            Register
          </label>
        </div>
        {authMode === "register" && (
          <RegisterForm authMode={authMode}></RegisterForm>
        )}

        {authMode === "login" && <LoginForm></LoginForm>}
      </div>
    </>
  );
}
