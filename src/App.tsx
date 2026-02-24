import { RouterProvider } from "react-router";
import router from "./router";
import { AuthInit } from "@/components/auth/AuthInit";

function App() {
  return (
    <AuthInit>
      <RouterProvider router={router} />
    </AuthInit>
  );
}

export default App;
