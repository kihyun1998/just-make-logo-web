"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Globe } from "lucide-react";
import { UserMenu } from "@just-apps/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";

import { i18nToLocale } from "@/lib/locale";

export function Header() {
  const { t, i18n } = useTranslation();
  const { toggleTheme } = useTheme();
  const { user, role, signOut } = useAuth();
  const router = useRouter();

  const currentLang = i18n.language.startsWith("ko") ? "ko" : "en";
  const locale = i18nToLocale(i18n.language);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          {t("header.title")}
        </Link>

        <div className="flex items-center gap-1">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
                <span className="sr-only">{t("common.language")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => i18n.changeLanguage("ko")}
                className={currentLang === "ko" ? "font-bold" : ""}
              >
                한국어
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => i18n.changeLanguage("en")}
                className={currentLang === "en" ? "font-bold" : ""}
              >
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-4 w-4 hidden dark:block" />
            <Moon className="h-4 w-4 block dark:hidden" />
            <span className="sr-only">{t("common.theme")}</span>
          </Button>

          {/* Auth */}
          {user ? (
            <UserMenu
              locale={locale}
              user={user}
              role={role === "admin" ? "admin" : "user"}
              onMyPage={() => router.push("/mypage")}
              onAdmin={() => router.push("/admin")}
              onSignOut={() => signOut()}
            />
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">{t("common.login")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
