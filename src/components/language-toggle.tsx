import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language.startsWith("pl") ? "en" : "pl";
    i18n.changeLanguage(next);
  };

  const nextLanguageLabel = i18n.language.startsWith("pl") ? "EN" : "PL";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={`Switch to ${nextLanguageLabel}`}
      className="gap-1.5"
    >
      <Globe className="size-4" />
      {nextLanguageLabel}
    </Button>
  );
}
