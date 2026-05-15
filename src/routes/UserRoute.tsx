import RouteError from "./RouteError";
import { lazy } from "react";

import ProtectedRoute from "./ProtectedRoute";
import LazyWrapper from "@/components/LazyWrapper";
import UserDashboardLayout from "@/pages/player/dashboard";

const NotFoundRoute = lazy(() => import("../components/notFound"));
const UserDashboard = lazy(
  () => import("../components/playersDashboard/index"),
);
const UserRoute = [
  {
    element: <ProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/dashboard",
        element: <UserDashboardLayout />,
        children: [
          {
            index: true,
            element: <LazyWrapper Component={UserDashboard} />,
          },
          {
            path: "*",
            element: <LazyWrapper Component={NotFoundRoute} />,
          },
        ],
      },
    ],
  },
];

export default UserRoute;
