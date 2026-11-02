"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";

const inputClass =
  "w-full h-11 px-4 rounded-[20px] border-2 border-ink-subtle bg-surface text-base text-ink outline-none transition-colors duration-200 focus:border-brand focus:ring-2 focus:ring-brand/30";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // Prevent the browser from submitting credentials as a GET query string.
    e.preventDefault();
    setError("");
    setNotice("");

    const form = new FormData(e.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.get("email"),
      password: form.get("password"),
      // Read by the handle_new_user trigger to fill profiles.display_name
      options: { data: { display_name: form.get("displayName") } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // No session means Supabase is waiting for the user to confirm their email.
    if (!data.session) {
      setNotice("Check your email to confirm your account, then log in.");
      setLoading(false);
      return;
    }
    router.push("/home");
    router.refresh();
  };

  return (
    <main
      id="signup-page"
      className="flex justify-center items-center min-h-screen p-4 bg-page"
    >
      <div
        id="signup-card"
        className="w-full max-w-sm bg-surface shadow-lg rounded-lg p-8"
      >
        <Link
          id="signup-logo-link"
          href="/home"
          aria-label="RUVEE home"
          className="block mx-auto mb-6 w-24"
        >
          <Image
            id="signup-logo"
            src="/images/logo_Ruvee.png"
            alt="Ruvee"
            width={375}
            height={104}
            priority
            className="w-24 h-auto"
          />
        </Link>
        <h1 id="signup-title" className="text-2xl font-bold text-center text-brand">
          Create account
        </h1>
        <p id="signup-subtitle" className="mt-1 mb-6 text-center text-ink-muted">
          Join RUVEE and start shopping
        </p>

        <form id="signup-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="signup-name" className="text-sm font-semibold text-ink">
              Display name
            </label>
            <input
              id="signup-name"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="signup-email" className="text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="signup-password" className="text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="signup-confirm-password"
              className="text-sm font-semibold text-ink"
            >
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Repeat your password"
              className={inputClass}
            />
          </div>
          {error && (
            <p id="signup-error" role="alert" className="text-sm text-center text-price">
              {error}
            </p>
          )}
          {notice && (
            <p id="signup-notice" role="status" className="text-sm text-center text-brand">
              {notice}
            </p>
          )}
          <button
            id="signup-submit-button"
            type="submit"
            disabled={loading}
            className="mt-2 h-11 rounded-full bg-brand text-on-brand font-semibold cursor-pointer transition duration-300 hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            id="signup-login-link"
            href="/login"
            className="font-semibold text-brand hover:text-brand-hover"
          >
            Log in
          </Link>
        </p>
        <Link
          id="signup-back-link"
          href="/home"
          className="block mt-2 text-center text-sm text-ink-muted hover:text-brand"
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}
