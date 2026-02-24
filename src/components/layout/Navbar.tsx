import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/language-toggle";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold text-sm font-heading">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-heading">
              Reno<span className="text-brand">Cost</span>
            </span>
          </a>

          {/* Desktop nav controls */}
          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle />
            <ModeToggle />
          </div>

          {/* Mobile nav controls */}
          <div className="flex items-center gap-1 md:hidden">
            <LanguageToggle />
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("nav.userMenu")}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-left font-heading">
                    RenoCost
                  </SheetTitle>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
