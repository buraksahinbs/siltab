"use client";

// Erişilebilir pencere: yerel <dialog> (odak tuzağı, Esc ile kapanma) üzerine kurulu.
// Açıkken sayfa kaydırması durur.

import { useEffect, useRef, type ReactNode } from "react";
import { useKaydirma } from "./Kaydirma";

type Props = {
  acik: boolean;
  kapat: () => void;
  baslik: string;
  children: ReactNode;
};

export default function Modal({ acik, kapat, baslik, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const kaydirma = useKaydirma();
  const baslikId = `modal-${baslik.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (acik && !d.open) {
      d.showModal();
      kaydirma.durdur();
    } else if (!acik && d.open) {
      d.close();
    }
  }, [acik, kaydirma]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const kapandi = () => {
      kaydirma.surdur();
      kapat();
    };
    d.addEventListener("close", kapandi);
    return () => d.removeEventListener("close", kapandi);
  }, [kapat, kaydirma]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={baslikId}
      className="modal koyu-alan"
      onClick={(e) => {
        // zemine tıklayınca kapat
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="relative w-full" data-lenis-prevent>
        <div className="flex items-start justify-between gap-6">
          <h2 id={baslikId} className="baslik-2">
            {baslik}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="group -mt-1 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center"
            aria-label="Kapat"
          >
            <span className="relative block h-4 w-4" aria-hidden="true">
              <span className="absolute top-1/2 left-0 h-px w-4 rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
              <span className="absolute top-1/2 left-0 h-px w-4 -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-45" />
            </span>
          </button>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </dialog>
  );
}
