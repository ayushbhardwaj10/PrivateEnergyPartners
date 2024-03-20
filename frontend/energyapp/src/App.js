import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
function App() {
  const appRouter = createBrowserRouter([{ path: "/", element: <Login /> }]);
  return <RouterProvider router={appRouter} />;
}

export default App;
