"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DonationModal } from "@/components/donate/donation-modal";

interface DonationContextValue {
  openDonation: (designation?: string) => void;
  closeDonation: () => void;
}

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [designation, setDesignation] = useState<string | undefined>(undefined);

  const openDonation = useCallback((nextDesignation?: string) => {
    setDesignation(nextDesignation);
    setOpen(true);
  }, []);

  const closeDonation = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openDonation, closeDonation }),
    [openDonation, closeDonation],
  );

  return (
    <DonationContext.Provider value={value}>
      {children}
      <DonationModal
        open={open}
        initialDesignation={designation}
        onClose={closeDonation}
      />
    </DonationContext.Provider>
  );
}

export function useDonation(): DonationContextValue {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation must be used inside a DonationProvider");
  }
  return context;
}
