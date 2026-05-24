import { lazy } from "react";

import RouteError from "./RouteError";
import PublicRoute from "./Public";
import LazyWrapper from "@/components/LazyWrapper";
import AuthLayout from "@/pages/auth";

// lazy loaded pages
const LandingPage = lazy(() => import("../pages/landing"));
const LoginPage = lazy(() => import("../pages/auth/login"));
const RegisterPage = lazy(() => import("../pages/auth/register"));
const NotFoundPage = lazy(() => import("../components/notFound"));

const CommonRoutes = [
  {
    element: <PublicRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        element: <LazyWrapper Component={LandingPage} />,
      },
      {
        path: "/login",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <LazyWrapper Component={LoginPage} />,
          },
        ],
      },
      {
        path: "/register",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <LazyWrapper Component={RegisterPage} />,
          },
        ],
      },
      {
        path: "*",
        element: <LazyWrapper Component={NotFoundPage} />,
      },
    ],
  },
];

export { CommonRoutes };
