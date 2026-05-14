import RouteError from "./RouteError";
import { lazy } from "react";
import AdministratorProtectedRoute from "./AdministratorProtectedRoutes";
import LazyWrapper from "@/components/LazyWrapper";
import DashboardLayout from "@/pages/admin/dashboard";

const NotFoundRoute = lazy(() => import("../components/notFound"));
const AdminDashboard = lazy(() => import("../pages/admin/dashboard/index"));

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
