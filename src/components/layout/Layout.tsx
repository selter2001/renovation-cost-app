import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";

export function Layout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 py-4 text-center text-sm text-muted-foreground">
        {t("footer.author")}
      </footer>
    </div>
  );
}
