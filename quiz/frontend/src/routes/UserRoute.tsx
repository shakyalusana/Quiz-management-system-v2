import RouteError from "./RouteError";
import { lazy } from "react";

import ProtectedRoute from "./ProtectedRoute";
import LazyWrapper from "@/components/LazyWrapper";
import UserDashboardLayout from "@/pages/player/dashboard";

const NotFoundRoute = lazy(() => import("../components/notFound"));
const UserDashboard = lazy(
  () => import("../components/playersDashboard/index"),
);
const UserQuiz = lazy(() => import("../pages/player/Quiz"));
// const UserQuizReview = lazy(() => import("../pages/player/quizReview"));
const UserHistory = lazy(() => import("../pages/player/history"));
const LeaderboardPage = lazy(() => import("../pages/player/leaderboard"));

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
            path: "quiz",
            element: <LazyWrapper Component={UserQuiz} />,
          },
          {
            path: "history",
            element: <LazyWrapper Component={UserHistory} />,
          },
          {
            path: "leaderboard",
            element: <LazyWrapper Component={LeaderboardPage} />,
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
