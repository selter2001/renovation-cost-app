import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted opacity-80"
        aria-hidden="true"
      />

      {/* Hero glassmorphism card */}
      <div className="w-full max-w-2xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-lg shadow-black/5 p-8 sm:p-12 text-center">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("home.title")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          {t("home.subtitle")}
        </p>
        <Button
          size="lg"
          className="rounded-xl px-8 py-3 text-base font-semibold"
        >
          {t("home.cta")}
        </Button>
      </div>
    </div>
  );
}
