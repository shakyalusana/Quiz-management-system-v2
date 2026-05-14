import RouteError from "./RouteError";
import { lazy } from "react";

import DashboardLayout from "@/components/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import LazyWrapper from "@/components/LazyWrapper";

const NotFoundRoute = lazy(() => import("../components/notFound"));
const UserRoute = [
  {
    element: <ProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
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