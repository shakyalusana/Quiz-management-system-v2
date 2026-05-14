import { lazy } from "react";

import RouteError from "./RouteError";
import PublicRoute from "./Public";
import LazyWrapper from "@/components/LazyWrapper";

// lazy loaded pages
const LoginPage = lazy(() => import("../pages/Auth/login"));
const RegisterPage = lazy(() => import("../pages/Auth/register"));
const NotFoundPage = lazy(() => import("../components/notFound"));

const CommonRoutes = [
  {
    element: <PublicRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: "login",
        element: <LazyWrapper Component={LoginPage} />,
      },
      {
        path: "register",
        element: <LazyWrapper Component={RegisterPage} />,
      },
      {
        path: "*",
        element: <LazyWrapper Component={NotFoundPage} />,
      },
    ],
  },
];

export { CommonRoutes };