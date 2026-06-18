import RouteError from "./RouteError";
import { lazy } from "react";
import AdministratorProtectedRoute from "./AdministratorProtectedRoutes";
import LazyWrapper from "@/components/LazyWrapper";
import AdminDashboardLayout from "../pages/admin/dashboard/index";

const NotFoundRoute = lazy(() => import("../components/notFound"));
const AdminDashboard = lazy(() => import("../components/adminDashboard/index"));
const AdminCategory = lazy(() => import("../pages/admin/category/index"));
const AdminQuestion = lazy(() => import("../pages/admin/question/index"));
const AdminPlayers = lazy(() => import("../pages/admin/players/index"));

const SuperAdmin = [
  {
    element: <AdministratorProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboardLayout />,
        children: [
          {
            index: true,
            element: <LazyWrapper Component={AdminDashboard} />,
          },
          {
            path: "categories",
            element: <LazyWrapper Component={AdminCategory} />,
          },
          {
            path: "questions",
            element: <LazyWrapper Component={AdminQuestion} />,
          },
          {
            path: "players",
            element: <LazyWrapper Component={AdminPlayers} />,
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
