"use client";

import type { ReactNode } from "react";
import { pencereAc } from "./Ust";

export default function PencereDugmesi({
  pencere,
  className,
  children,
}: {
  pencere: "tamir" | "bayi";
  className?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => pencereAc(pencere)}>
      {children}
    </button>
  );
}
