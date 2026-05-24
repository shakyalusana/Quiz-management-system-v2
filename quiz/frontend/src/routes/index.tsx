import { createBrowserRouter } from "react-router-dom";

import { CommonRoutes } from "./CommonRoute";
import UserRoute from "./UserRoute";
import AdminRoute from "./SuperAdminRoute";

export const router = createBrowserRouter([
  ...CommonRoutes,
  ...AdminRoute,
  ...UserRoute,
]);