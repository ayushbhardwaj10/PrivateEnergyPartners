import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedComponent from "./components/ProtectedComponent";
import Store from "./utils/ReduxStore/Store";
import { Provider } from "react-redux";

function App() {
  const appRouter = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/home", element: <ProtectedComponent Component={Home} /> },
  ]);
  return (
    <div className="bg-[#F6F6F6]">
      <Provider store={Store}>
        <RouterProvider router={appRouter} />
      </Provider>
    </div>
  );
}

export default App;
