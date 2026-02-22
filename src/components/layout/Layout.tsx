import { Outlet } from "react-router";
import { Navbar } from "@/components/layout/Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
