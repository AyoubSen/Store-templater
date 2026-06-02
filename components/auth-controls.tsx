"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";

export function AuthControls() {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <LanguageSwitcher />
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            className="min-h-8 rounded-md border border-[#d8dde5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9]"
            type="button"
          >
            {t("auth.signIn")}
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="min-h-8 rounded-md bg-[#111827] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#1f2937]" type="button">
            {t("auth.signUp")}
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
