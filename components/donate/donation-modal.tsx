"use client";

import { useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Landmark, ReceiptText, X } from "lucide-react";
import { DonationForm } from "@/components/donate/donation-form";
import { OmMark } from "@/components/ui/om-mark";
import { useDialog } from "@/lib/use-dialog";

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  initialDesignation?: string;
}

export function DonationModal({
  open,
  onClose,
  initialDesignation,
}: DonationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDialog(open, dialogRef, close);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-maroon-deep/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-dialog-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto w-full max-w-2xl rounded-3xl border border-gold/30 bg-cream shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]"
          >
            <div className="relative overflow-hidden rounded-t-3xl bg-maroon px-5 py-6 text-cream sm:px-8">
              <div
                className="absolute -top-20 -right-16 h-56 w-56 rounded-full border border-gold/15"
                aria-hidden="true"
              />
              <div
                className="absolute top-8 right-8 h-32 w-32 rounded-full border border-gold/10"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                  <OmMark size="sm" variant="outline" className="mt-0.5" />
                  <div>
                    <p className="text-[0.62rem] font-semibold tracking-[0.25em] text-gold uppercase">
                      Dakshina & Seva
                    </p>
                    <h2
                      id="donation-dialog-title"
                      className="mt-1.5 font-serif text-2xl text-cream sm:text-[1.7rem]"
                    >
                      Support the Ashram
                    </h2>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-cream/65">
                      Your offering becomes annadanam, care for seekers and the
                      quiet work that keeps the ashram open to all.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close donation form"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/75 transition hover:border-gold/60 hover:bg-cream/10 hover:text-cream"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="relative mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.65rem] text-cream/55">
                <span className="flex items-center gap-1.5">
                  <Landmark className="h-3 w-3 text-gold/80" aria-hidden="true" />
                  UPI or bank transfer
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-gold/80" aria-hidden="true" />
                  No card details
                </span>
                <span className="flex items-center gap-1.5">
                  <ReceiptText className="h-3 w-3 text-gold/80" aria-hidden="true" />
                  80G on request
                </span>
              </div>
            </div>

            <div className="max-h-[calc(100dvh-14rem)] overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
              <DonationForm initialDesignation={initialDesignation} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
