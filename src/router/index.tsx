import { createHashRouter, Outlet } from "react-router";
import HomePage from "@/pages/HomePage";

function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
]);

export default router;
