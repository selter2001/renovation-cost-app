import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-heading)" }}>
        {t("home.title")}
      </h1>
      <p className="text-lg text-center opacity-70 mb-8">
        {t("home.subtitle")}
      </p>
      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
        {t("home.cta")}
      </button>
    </div>
  );
}
