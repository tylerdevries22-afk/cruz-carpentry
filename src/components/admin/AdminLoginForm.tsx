"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "@/app/actions/admin";

const initial: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initial);
  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[#57534E]">Admin password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[#D6CCBC] bg-white px-3 py-2.5 text-sm text-[#1C1917] outline-none focus:ring-2 focus:ring-[#B45309]"
        />
      </label>
      {state.error && <p className="text-sm text-[#B91C1C]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#B45309] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#92400E] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-2"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
