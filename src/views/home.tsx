"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-6">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-lg">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  features,
  badge,
  currentlyFree,
  highlighted,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  badge?: string;
  currentlyFree?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 ${
        highlighted
          ? "border-primary/50 bg-primary/5 shadow-md"
          : "bg-card"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          {badge}
        </span>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      {currentlyFree && (
        <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
          {currentlyFree}
        </p>
      )}
      <ul className="mt-5 flex flex-col gap-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <svg
              className="size-4 shrink-0 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
        </svg>
      ),
      title: t("home.features.noAi.title"),
      description: t("home.features.noAi.description"),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
      ),
      title: t("home.features.fast.title"),
      description: t("home.features.fast.description"),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      title: t("home.features.export.title"),
      description: t("home.features.export.description"),
    },
    {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
      title: t("home.features.asset.title"),
      description: t("home.features.asset.description"),
    },
  ];

  const freeTierFeatures = t("home.pricing.free.features", {
    returnObjects: true,
  }) as string[];
  const proTierFeatures = t("home.pricing.pro.features", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          {t("home.subtitle")}
        </p>
        <div className="flex gap-3 pt-2">
          <Button size="lg" asChild>
            <Link href="/editor">{t("home.cta")}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/editor/asset">{t("home.ctaAsset")}</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold">
          {t("home.features.title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto w-full max-w-2xl px-4 py-16">
        <h2 className="mb-2 text-center text-2xl font-bold">
          {t("home.pricing.title")}
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          {t("home.pricing.subtitle")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <PricingCard
            title={t("home.pricing.free.title")}
            price={t("home.pricing.free.price")}
            period={t("home.pricing.free.period")}
            features={freeTierFeatures}
          />
          <PricingCard
            title={t("home.pricing.pro.title")}
            price={t("home.pricing.pro.price")}
            period={t("home.pricing.pro.period")}
            features={proTierFeatures}
            badge={t("home.pricing.pro.badge")}
            currentlyFree={t("home.pricing.pro.currentlyFree")}
            highlighted
          />
        </div>
      </section>
    </div>
  );
}
