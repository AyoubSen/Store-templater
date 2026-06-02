"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export type GuidedTourStep = {
  target: string;
  title: string;
  body: string;
};

type HighlightRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export function GuidedTour({
  isOpen,
  onClose,
  steps,
}: {
  isOpen: boolean;
  onClose: () => void;
  steps: GuidedTourStep[];
}) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rect, setRect] = useState<HighlightRect | null>(null);
  const frameRef = useRef<number | null>(null);
  const currentStep = steps[currentIndex];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const target = document.querySelector(`[data-tour="${currentStep?.target}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [currentStep?.target, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function measureTarget() {
      const target = document.querySelector(`[data-tour="${currentStep?.target}"]`);

      if (!target) {
        setRect(null);
        return;
      }

      const nextRect = target.getBoundingClientRect();
      setRect({
        height: nextRect.height,
        left: nextRect.left,
        top: nextRect.top,
        width: nextRect.width,
      });
    }

    function scheduleMeasure() {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        measureTarget();
      });
    }

    scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", scheduleMeasure, true);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure, true);
    };
  }, [currentStep?.target, isOpen]);

  const tooltipStyle = useMemo(() => {
    if (!rect) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const tooltipWidth = 340;
    const gap = 14;
    const canFitRight = rect.left + rect.width + gap + tooltipWidth < window.innerWidth;
    const canFitLeft = rect.left - gap - tooltipWidth > 0;
    const left = canFitRight ? rect.left + rect.width + gap : canFitLeft ? rect.left - gap - tooltipWidth : Math.max(16, rect.left);
    const top = Math.min(Math.max(16, rect.top), Math.max(16, window.innerHeight - 220));

    return {
      left,
      top,
      transform: "none",
      width: tooltipWidth,
    };
  }, [rect]);

  if (!isOpen || !currentStep) {
    return null;
  }

  function finishTour() {
    setCurrentIndex(0);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-slate-950/65 transition-opacity duration-200" />
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-lg border-2 border-white bg-transparent shadow-[0_0_0_9999px_rgb(15_23_42_/_0.62),0_20px_60px_rgb(15_23_42_/_0.28)] transition-[left,top,width,height] duration-200 ease-out"
          style={{
            height: rect.height + 12,
            left: rect.left - 6,
            top: rect.top - 6,
            width: rect.width + 12,
          }}
        />
      ) : null}
      <section
        className="absolute w-[min(340px,calc(100vw-32px))] rounded-lg border border-[#d8dde5] bg-white p-4 text-[#111827] shadow-2xl shadow-slate-950/30 transition-[left,top,transform,opacity] duration-200 ease-out"
        style={tooltipStyle}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[#64748b]">
              {t("tour.step")} {currentIndex + 1} {t("tour.of")} {steps.length}
            </p>
            <h2 className="mt-1 text-base font-semibold leading-6">{currentStep.title}</h2>
          </div>
          <button className="rounded-md px-2 py-1 text-xs font-medium text-[#64748b] hover:bg-[#f1f5f9]" onClick={finishTour} type="button">
            {t("tour.skip")}
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#475569]">{currentStep.body}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            aria-disabled={currentIndex === 0}
            className={`rounded-md border border-[#d8dde5] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] ${
              currentIndex === 0 ? "cursor-not-allowed opacity-40" : ""
            }`}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            type="button"
          >
            {t("tour.back")}
          </button>
          <button
            className="rounded-md bg-[#111827] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1f2937]"
            onClick={() => {
              if (currentIndex >= steps.length - 1) {
                finishTour();
                return;
              }

              setCurrentIndex((index) => index + 1);
            }}
            type="button"
          >
            {currentIndex >= steps.length - 1 ? t("tour.finish") : t("tour.next")}
          </button>
        </div>
      </section>
    </div>
  );
}
