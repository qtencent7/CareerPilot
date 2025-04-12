import { createHashRouter } from "react-router";
import History from "../pages/history";
import App from "../App";
import About from "../pages/about";
import Settings from "../pages/settings";

export const router = createHashRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/history",
        element: <History/>
      },
      {
        path: "/about",
        element: <About/>
      },
      {
        path: "/settings",
        element: <Settings/>
      },
    ],
  },
]);
