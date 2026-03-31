"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthInitializer } from "@/components/auth-initializer";
import "@/i18n";
import { detectAndApplyLanguage } from "@/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    detectAndApplyLanguage();
  }, []);

  return (
    <ThemeProvider>
      <AuthInitializer />
      {children}
    </ThemeProvider>
  );
}
