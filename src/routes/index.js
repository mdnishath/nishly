import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Root from "../components/Root";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Message from "../pages/Message";
import Notification from "../pages/Notification";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/message" element={<Message />} />
      <Route path="/notification" element={<Notification />} />
    </Route>
  )
);

export default router;
