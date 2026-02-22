import { createHashRouter } from "react-router";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";

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
