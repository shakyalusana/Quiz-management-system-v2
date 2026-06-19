import {
  LayoutDashboard,
  PlayCircle,
  History,
  ClipboardCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LinkComponent from "../Link";
import { AppSidebar, type NavItem } from "../AppSideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const items: NavItem[] = [
  { title: "Welcome", url: "/players", icon: Sparkles },
  { title: "Dashboard", url: "/players/dashboard", icon: LayoutDashboard },
  { title: "Take Quiz", url: "/players/quiz", icon: PlayCircle },
  { title: "Quiz Review", url: "/players/quiz-review", icon: ClipboardCheck },
  { title: "History", url: "/players/history", icon: History },
  { title: "Leaderboard", url: "/players/leaderboard", icon: Trophy },
];

export default function PlayersLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* 🌫️ ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-112 w-md bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-112 w-md bg-purple-500/10 blur-[140px]" />
        </div>

        <AppSidebar label="Player" items={items} />

        <SidebarInset>
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-14 flex items-center gap-3 border-b bg-background/60 backdrop-blur-xl px-4 sticky top-0 z-10"
          >
            <SidebarTrigger />

            <div className="ml-auto flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button asChild size="sm" variant="outline">
                  <LinkComponent href="/players/quiz">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Quick Quiz
                  </LinkComponent>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar className="h-8 w-8 ring-1 ring-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    PL
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </motion.header>

          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6"
          >
            <Outlet />
          </motion.main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
