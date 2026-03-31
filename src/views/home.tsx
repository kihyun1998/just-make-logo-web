"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
      <h1 className="text-4xl font-bold">{t("home.title")}</h1>
      <p className="text-lg text-muted-foreground">{t("home.subtitle")}</p>
      <div className="flex gap-3">
        <Button size="lg" asChild>
          <Link href="/editor">{t("home.cta")}</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/editor/asset">{t("home.ctaAsset")}</Link>
        </Button>
      </div>
    </div>
  );
}
