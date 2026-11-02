"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";

const inputClass =
  "w-full h-11 px-4 rounded-[20px] border-2 border-ink-subtle bg-surface text-base text-ink outline-none transition-colors duration-200 focus:border-brand focus:ring-2 focus:ring-brand/30";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // Prevent the browser from submitting credentials as a GET query string.
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push("/home");
    router.refresh();
  };

  return (
    <main
      id="login-page"
      className="flex justify-center items-center min-h-screen p-4 bg-page"
    >
      <div
        id="login-card"
        className="w-full max-w-sm bg-surface shadow-lg rounded-lg p-8"
      >
        <Link
          id="login-logo-link"
          href="/home"
          aria-label="RUVEE home"
          className="block mx-auto mb-6 w-24"
        >
          <Image
            id="login-logo"
            src="/images/logo_Ruvee.png"
            alt="Ruvee"
            width={375}
            height={104}
            priority
            className="w-24 h-auto"
          />
        </Link>
        <h1 id="login-title" className="text-2xl font-bold text-center text-brand">
          Welcome back
        </h1>
        <p id="login-subtitle" className="mt-1 mb-6 text-center text-ink-muted">
          Log in to continue shopping
        </p>

        <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-sm font-semibold text-ink">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
              className={inputClass}
            />
          </div>
          {error && (
            <p id="login-error" role="alert" className="text-sm text-center text-price">
              {error}
            </p>
          )}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className="mt-2 h-11 rounded-full bg-brand text-on-brand font-semibold cursor-pointer transition duration-300 hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          New to RUVEE?{" "}
          <Link
            id="login-signup-link"
            href="/signup"
            className="font-semibold text-brand hover:text-brand-hover"
          >
            Sign up
          </Link>
        </p>

        <Link
          id="login-back-link"
          href="/home"
          className="block mt-2 text-center text-sm text-ink-muted hover:text-brand"
        >
          Back to shop
        </Link>
      </div>
    </main>
  );
}
