import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-12">
      {/* Hero glassmorphism card */}
      <div className="w-full max-w-2xl rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md shadow-xl p-8 sm:p-12 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl font-heading mb-4">
          {t("home.title")}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
          {t("home.subtitle")}
        </p>
        <Button
          size="lg"
          className="rounded-xl bg-brand px-8 py-3 text-base font-semibold text-brand-foreground hover:bg-brand/90"
        >
          {t("home.cta")}
        </Button>
      </div>
    </div>
  );
}
