import { Menu, User } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="#/"
            className="font-bold text-xl tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="bg-gradient-to-r from-primary to-ring bg-clip-text text-transparent">
              RenoCost
            </span>
          </a>

          {/* Desktop nav controls */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="size-4" />
              {t("nav.userMenu")}
            </Button>
          </div>

          {/* Mobile nav controls */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageToggle />
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle
                    className="text-left"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    RenoCost
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  <Button variant="ghost" className="justify-start gap-2">
                    <User className="size-4" />
                    {t("nav.userMenu")}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
