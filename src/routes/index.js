import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

export const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
];
