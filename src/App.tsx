import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./router/AppRouter"

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;