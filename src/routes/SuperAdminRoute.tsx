
import RouteError from "./RouteError";
import { lazy } from "react";
import DashboardLayout from "@/components/dashboard";
import AdministratorProtectedRoute from "./AdministratorProtectedRoutes";
import LazyWrapper from "@/components/LazyWrapper";

const NotFoundRoute = lazy(() => import("../components/notFound"));

const SuperAdmin = [
  {
    element: <AdministratorProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <LazyWrapper Component={AdminDashboard} />,
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

export default SuperAdmin;