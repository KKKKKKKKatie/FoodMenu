"use client";

import { useState } from "react";

export function AdminLoginForm({
  action,
  hasError,
  usingDemoCredentials,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hasError: boolean;
  usingDemoCredentials: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="stack">
      {usingDemoCredentials ? (
        <p className="notice">
          Local demo login: admin@example.com / demo123456. This will switch automatically once environment variables
          are configured.
        </p>
      ) : null}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="admin@example.com" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="password-row">
          <input id="password" name="password" type={showPassword ? "text" : "password"} required />
          <button
            type="button"
            className="button button--ghost password-toggle"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
      </div>
      {hasError ? <p className="notice">Incorrect email or password.</p> : null}
      <button type="submit">Sign In</button>
    </form>
  );
}
