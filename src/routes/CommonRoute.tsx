import { lazy } from "react";

import RouteError from "./RouteError";
import PublicRoute from "./Public";
import LazyWrapper from "@/components/LazyWrapper";

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
