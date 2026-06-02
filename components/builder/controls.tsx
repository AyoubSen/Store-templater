"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const colorPresets = [
  "#111827",
  "#ffffff",
  "#f8fafc",
  "#2563eb",
  "#1f7a5f",
  "#f2c078",
  "#ef6f6c",
  "#7c3aed",
  "#0f766e",
  "#ea580c",
  "#be123c",
  "#64748b",
];

type HsvColor = {
  h: number;
  s: number;
  v: number;
};

export function ColorTokenControl({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const normalizedValue = normalizeHex(value);
  const hsv = hexToHsv(normalizedValue);
  const hueColor = hsvToHex({ h: hsv.h, s: 100, v: 100 });

  function updateHsv(nextHsv: HsvColor) {
    onChange(hsvToHex(nextHsv));
  }

  function pickColor(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

    event.currentTarget.setPointerCapture(event.pointerId);
    window.getSelection()?.removeAllRanges();
    updateHsv({
      ...hsv,
      s: Math.round(x),
      v: Math.round(100 - y),
    });
  }

  return (
    <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
      <p className="text-xs font-medium capitalize text-[#475569]">{label}</p>
      <Popover.Trigger asChild>
        <button
          aria-label={`Edit ${label} color`}
          className="mt-1 flex w-full items-center gap-2 rounded-md border border-[#d8dde5] bg-white p-1.5 text-left shadow-sm hover:border-[#cbd5e1]"
          type="button"
        >
          <span className="h-7 w-7 shrink-0 rounded border border-black/10" style={{ background: normalizedValue }} />
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase text-[#64748b]">{normalizedValue}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          avoidCollisions
          className="z-50 w-72 select-none rounded-lg border border-[#d8dde5] bg-white p-3 shadow-xl shadow-slate-900/10"
          collisionPadding={8}
          side="bottom"
          sideOffset={6}
        >
          <div
            className="relative h-40 cursor-crosshair touch-none overflow-hidden rounded-md border border-black/10"
            onDragStart={(event) => event.preventDefault()}
            onPointerDown={pickColor}
            onPointerMove={(event) => {
              if (event.buttons === 1) {
                pickColor(event);
              }
            }}
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
            }}
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_4px_rgb(15_23_42_/_0.35)]"
              style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
              viewBox="0 0 20 20"
            >
              <circle cx="10" cy="10" fill="none" r="7" stroke="rgb(15 23 42 / 0.42)" strokeWidth="2" />
              <circle cx="10" cy="10" fill="none" r="6.25" stroke="white" strokeWidth="2.5" />
              <circle cx="10" cy="10" fill={normalizedValue} r="3.2" stroke="rgb(15 23 42 / 0.18)" strokeWidth="0.8" />
            </svg>
          </div>

          <div className="mt-3 space-y-2">
            <ColorSlider label={t("inspector.hue")} max={360} onChange={(nextHue) => updateHsv({ ...hsv, h: nextHue })} value={hsv.h} variant="hue" />
            <ColorSlider label={t("inspector.sat")} max={100} onChange={(nextSaturation) => updateHsv({ ...hsv, s: nextSaturation })} value={hsv.s} />
            <ColorSlider label={t("inspector.variant.light")} max={100} onChange={(nextValue) => updateHsv({ ...hsv, v: nextValue })} value={hsv.v} />
          </div>

          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {colorPresets.map((preset) => (
              <button
                aria-label={`Use ${preset}`}
                className={`h-6 rounded border ${normalizeHex(preset) === normalizedValue ? "border-[#111827]" : "border-black/10"}`}
                key={preset}
                onClick={() => {
                  onChange(preset);
                  setIsOpen(false);
                }}
                style={{ background: preset }}
                type="button"
              />
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ColorSlider({
  label,
  max,
  onChange,
  value,
  variant = "plain",
}: {
  label: string;
  max: number;
  onChange: (value: number) => void;
  value: number;
  variant?: "hue" | "plain";
}) {
  return (
    <label className="grid grid-cols-[34px_1fr_34px] items-center gap-2 text-[11px] font-medium text-[#64748b]">
      <span>{label}</span>
      <input
        className={`h-2 w-full cursor-pointer appearance-none rounded-full ${variant === "hue" ? "color-slider-hue" : "color-slider-plain"}`}
        max={max}
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
      <span className="text-right font-mono">{value}</span>
    </label>
  );
}

export function TextField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block text-xs font-medium text-[#475569]">
      {label}
      <input
        className="mt-1.5 w-full rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-sm text-[#111827] shadow-sm"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export function TextArea({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block text-xs font-medium text-[#475569]">
      {label}
      <textarea
        className="mt-1.5 min-h-24 w-full resize-y rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-sm leading-6 text-[#111827] shadow-sm"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export function NumberField({
  label,
  min,
  onChange,
  value,
}: {
  label: string;
  min?: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="block text-xs font-medium text-[#475569]">
      {label}
      <input
        className="mt-1.5 w-full rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-sm text-[#111827] shadow-sm"
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

export function GradientField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  const { t } = useI18n();
  const [firstColor, secondColor] = parseGradient(value);

  function updateGradient(nextFirstColor: string, nextSecondColor: string) {
    onChange(`linear-gradient(135deg, ${nextFirstColor}, ${nextSecondColor})`);
  }

  return (
    <div>
      <p className="text-xs font-medium text-[#475569]">{label}</p>
      <div className="mt-1.5 rounded-md border border-[#d8dde5] bg-white p-2 shadow-sm">
        <div className="mb-2 h-16 rounded-md border border-black/10" style={{ background: value }} />
        <div className="grid grid-cols-2 gap-2">
          <MiniColorButton label={t("inspector.start")} onChange={(color) => updateGradient(color, secondColor)} value={firstColor} />
          <MiniColorButton label={t("inspector.end")} onChange={(color) => updateGradient(firstColor, color)} value={secondColor} />
        </div>
      </div>
    </div>
  );
}

function MiniColorButton({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[#e2e8f0] px-2 py-1.5 text-xs font-medium text-[#64748b] hover:bg-[#f8fafc]">
      <span className="h-5 w-5 rounded border border-black/10" style={{ background: value }} />
      <span>{label}</span>
      <input className="sr-only" onChange={(event) => onChange(event.target.value)} type="color" value={value} />
    </label>
  );
}

export function ListEditor({
  label,
  onChange,
  placeholder,
  values,
}: {
  label: string;
  onChange: (value: string[]) => void;
  placeholder: string;
  values: string[];
}) {
  const { t } = useI18n();

  function updateItem(index: number, value: string) {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-medium text-[#475569]">{label}</p>
        <button
          className="min-h-7 rounded-md border border-[#d8dde5] bg-white px-2 py-1 text-xs font-medium leading-4 text-[#334155] hover:bg-[#f1f5f9]"
          onClick={() => onChange([...values, ""])}
          type="button"
        >
          {t("builder.add")}
        </button>
      </div>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2" key={`${label}-${index}`}>
            <input
              className="min-w-0 flex-1 rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-sm text-[#111827] shadow-sm"
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
              value={item}
            />
            <button
              className="min-h-9 rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-xs font-medium leading-4 text-[#64748b] hover:bg-[#f1f5f9]"
              onClick={() => removeItem(index)}
              type="button"
            >
              {t("common.remove")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RangeControl({
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}) {
  return (
    <label className="block text-xs font-medium text-[#475569]">
      <span className="flex items-start justify-between gap-3">
        {label}
        <span className="shrink-0 font-mono text-[#64748b]">{value}</span>
      </span>
      <input
        className="mt-2 w-full accent-[#2563eb]"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

export function SelectControl<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: TValue) => void;
  options: Array<{ label: string; value: TValue }>;
  value: TValue;
}) {
  return (
    <label className="block text-xs font-medium text-[#475569]">
      {label}
      <select
        className="mt-1.5 w-full rounded-md border border-[#d8dde5] bg-white px-2.5 py-2 text-sm text-[#111827] shadow-sm"
        onChange={(event) => onChange(event.target.value as TValue)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function stringSetting(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function arraySetting(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export function numberSetting(value: unknown, fallback: number) {
  return typeof value === "number" ? value : fallback;
}

function parseGradient(value: string) {
  const matches = value.match(/#[0-9a-fA-F]{6}/g);

  if (matches?.length && matches.length >= 2) {
    return [matches[0], matches[1]] as const;
  }

  return ["#dbeafe", "#f8fafc"] as const;
}

function normalizeHex(value: string) {
  const trimmed = value.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return "#000000";
}

function hexToHsv(hex: string): HsvColor {
  const red = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const green = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  if (hue < 0) {
    hue += 360;
  }

  return {
    h: Math.round(hue),
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100),
  };
}

function hsvToHex({ h, s, v }: HsvColor) {
  const saturation = s / 100;
  const value = v / 100;
  const chroma = value * saturation;
  const huePrime = h / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const match = value - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime >= 1 && huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime >= 3 && huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return `#${toHexChannel(red + match)}${toHexChannel(green + match)}${toHexChannel(blue + match)}`;
}

function toHexChannel(value: number) {
  return Math.round(value * 255).toString(16).padStart(2, "0").toUpperCase();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
