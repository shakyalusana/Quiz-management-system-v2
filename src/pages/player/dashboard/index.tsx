import {
  LayoutDashboard,
  PlayCircle,
  History,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import { AppSidebar, type NavItem } from "@/components/AppSideBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LinkComponent } from "@/components/Link";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const items: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Take Quiz", url: "/quiz", icon: PlayCircle },
  { title: "Quiz Review", url: "/quiz-review", icon: ClipboardCheck },
  { title: "History", url: "/history", icon: History },
];

export default function UserDashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar label="Player" items={items} />
        <SidebarInset>
          <header className="h-14 flex items-center gap-3 border-b bg-background/80 backdrop-blur px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <AnimatedThemeToggler />
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
