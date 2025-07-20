"use client";

import { cn } from "@/lib/utils";
import { CircleCheckIcon } from "lucide-react";

interface SuccessAlertProps {
  show: boolean;
  className?: string;
}

export function SuccessAlert({ show, className }: SuccessAlertProps) {
  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 transform -translate-x-1/2 z-50",
        "border-green-200 bg-green-50 rounded-md border px-4 py-3 shadow-lg",
        "transition-all duration-1000 ease-out",
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-8 pointer-events-none",
        className
      )}
    >
      <p className="text-sm text-green-800">
        <CircleCheckIcon
          className="me-3 -mt-0.5 inline-flex text-emerald-500"
          size={16}
          aria-hidden="true"
        />
        Completed successfully!
      </p>
    </div>
  );
}
