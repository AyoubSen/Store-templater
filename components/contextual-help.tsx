"use client";

import * as Popover from "@radix-ui/react-popover";

export function ContextualHelp({ body, title }: { body: string; title: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-label={title}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#d8dde5] bg-white text-[11px] font-semibold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#111827]"
          type="button"
        >
          ?
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[80] w-[min(280px,calc(100vw-32px))] rounded-lg border border-[#d8dde5] bg-white p-3 text-left shadow-2xl shadow-slate-950/20"
          collisionPadding={12}
          sideOffset={8}
        >
          <p className="break-words text-xs font-semibold text-[#111827]">{title}</p>
          <p className="mt-1 break-words text-xs leading-5 text-[#64748b]">{body}</p>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
