import {
  RouterProvider,
} from "react-router";
import { router } from "./routes";

const Popup = () => {

  return (
    <RouterProvider router={router} />
  )
}

export default Popup