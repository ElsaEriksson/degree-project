"use client";

import { useCallback } from "react";
import { useState } from "react";
import LoginForm from "./loginFrom";
import RegisterForm from "./registerForm";

export default function AuthFormSwitcher() {
  const [authMode, setAuthMode] = useState("login");

  const handleAuthModeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAuthMode(event.target.value);
    },
    []
  );

  return (
    <div>
      <div className="mb-4">
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
  );
}
