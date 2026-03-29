"use client";

import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 py-6 text-sm text-muted-foreground">
        <p>{t("footer.description")}</p>
        <p>{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
