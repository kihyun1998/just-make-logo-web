"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import "@/i18n";
import { detectAndApplyLanguage } from "@/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  // Apply stored/detected language after hydration
  useEffect(() => {
    detectAndApplyLanguage();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
