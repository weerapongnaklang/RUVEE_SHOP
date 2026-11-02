"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabase";
import { CloseIcon } from "./icons";

const ProfileDrawer = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // undefined = still checking, null = signed out
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const userId = user?.id;

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("display_name, email, phone, created_at")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile(data);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const trigger = triggerRef.current;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  };

  const email = profile?.email || user?.email || "";
  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        id="profile-link"
        type="button"
        aria-label={user ? "Open account panel" : "Open login panel"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="profile-drawer"
        onClick={() => setOpen(true)}
        className="block cursor-pointer rounded-full"
      >
        {user ? (
          <span
            id="profile-initial"
            className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-on-brand"
          >
            {initial}
          </span>
        ) : (
          <Image
            id="profile-image"
            src="/images/profile.png"
            alt="Profile"
            width={500}
            height={500}
            sizes="30px"
            className="size-8 shrink-0 rounded-full object-cover"
          />
        )}
      </button>

      <div
        id="profile-drawer-overlay"
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="profile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Account"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-full flex-col bg-surface shadow-lg transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          id="profile-drawer-header"
          className="flex items-center justify-between border-b-2 border-brand p-4"
        >
          <h2 id="profile-drawer-title" className="text-xl font-bold text-brand">
            Account
          </h2>
          <button
            ref={closeRef}
            id="profile-drawer-close"
            type="button"
            aria-label="Close account panel"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-full p-2 text-ink transition-colors duration-200 hover:bg-brand hover:text-on-brand"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div id="profile-drawer-body" className="flex flex-1 flex-col p-6">
          {user === undefined && (
            <div
              id="profile-drawer-loading"
              role="status"
              aria-label="Checking login status"
              className="flex animate-pulse flex-col items-center gap-3"
            >
              <div className="size-20 rounded-full bg-page" />
              <div className="h-5 w-32 rounded bg-page" />
              <div className="h-4 w-44 rounded bg-page" />
            </div>
          )}

          {user === null && (
            <div
              id="profile-drawer-guest"
              className="flex flex-col items-center gap-4 text-center"
            >
              <Image
                id="profile-drawer-guest-image"
                src="/images/profile.png"
                alt=""
                width={500}
                height={500}
                sizes="80px"
                className="size-20 rounded-full object-cover"
              />
              <h3 className="text-lg font-bold text-ink">Welcome to RUVEE</h3>
              <p className="text-ink-muted">
                Log in to see your account and keep shopping.
              </p>
              <Link
                id="drawer-login-button"
                href="/login"
                className="block h-11 w-full rounded-full bg-brand text-center font-semibold leading-[2.75rem] text-on-brand transition duration-300 hover:bg-brand-hover"
              >
                LOG IN
              </Link>
              <p className="text-sm text-ink-muted">
                New to RUVEE?{" "}
                <Link
                  id="drawer-signup-link"
                  href="/signup"
                  className="font-semibold text-brand hover:text-brand-hover"
                >
                  Sign up
                </Link>
              </p>
            </div>
          )}

          {user && (
            <div id="profile-drawer-user" className="flex flex-1 flex-col">
              <div className="flex flex-col items-center gap-1 text-center">
                <span
                  id="profile-drawer-avatar"
                  className="mb-2 flex size-20 items-center justify-center rounded-full bg-brand text-3xl font-bold text-on-brand"
                >
                  {initial}
                </span>
                <h3 id="profile-drawer-name" className="text-lg font-bold text-ink">
                  {displayName}
                </h3>
                <p id="profile-drawer-email" className="break-all text-ink-muted">
                  {email}
                </p>
              </div>

              <dl
                id="profile-drawer-details"
                className="mt-6 flex flex-col gap-3 border-t border-ink-subtle pt-4 text-sm"
              >
                {profile?.phone && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Phone</dt>
                    <dd id="profile-drawer-phone" className="text-ink">
                      {profile.phone}
                    </dd>
                  </div>
                )}
                {memberSince && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Member since</dt>
                    <dd id="profile-drawer-member-since" className="text-ink">
                      {memberSince}
                    </dd>
                  </div>
                )}
              </dl>

              <button
                id="drawer-logout-button"
                type="button"
                onClick={handleLogout}
                className="mt-auto h-11 w-full cursor-pointer rounded-full border-2 border-brand font-semibold text-brand transition duration-300 hover:bg-brand hover:text-on-brand"
              >
                LOG OUT
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ProfileDrawer;
