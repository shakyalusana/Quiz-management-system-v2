import {
  LayoutDashboard,
  PlayCircle,
  History,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LinkComponent from "../Link";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar, type NavItem } from "../AppSideBar";

const items: NavItem[] = [
  { title: "Welcome", url: "/players", icon: Sparkles },
  { title: "Dashboard", url: "/players/dashboard", icon: LayoutDashboard },
  { title: "Take Quiz", url: "/players/quiz", icon: PlayCircle },
  { title: "Quiz Review", url: "/players/quiz-review", icon: ClipboardCheck },
  { title: "History", url: "/players/history", icon: History },
];

export default function PlayersLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar label="Player" items={items} />
        <SidebarInset>
          <header className="h-14 flex items-center gap-3 border-b bg-background/80 backdrop-blur px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <Button asChild size="sm" variant="outline">
                <LinkComponent href="/players/quiz">
                  <PlayCircle className="h-4 w-4" /> Quick Quiz
                </LinkComponent>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  PL
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
