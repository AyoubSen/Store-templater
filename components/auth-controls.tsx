"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function AuthControls() {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            className="rounded-md border border-[#d8dde5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            type="button"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="rounded-md bg-[#111827] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#1f2937]" type="button">
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <div className="rounded-full border border-[#d8dde5] bg-white p-0.5 shadow-sm">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7",
              },
            }}
          />
        </div>
      </Show>
    </div>
  );
}
