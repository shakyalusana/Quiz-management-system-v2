import { LayoutDashboard, PlayCircle, History } from "lucide-react";
import { Outlet } from "react-router-dom";
import { AppSidebar, type NavItem } from "@/components/AppSideBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import DefaultContainer from "@/components/DefaultContainer";

const items: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Take Quiz", url: "/dashboard/quiz", icon: PlayCircle },
  { title: "History", url: "/dashboard/history", icon: History },
];

export default function UserDashboardLayout() {
  return (
    <SidebarProvider>
      <DefaultContainer className="min-h-screen flex w-full bg-background">
        <AppSidebar label="Player" items={items} />
        <SidebarInset>
          <header className="h-14 flex items-center gap-3 border-b bg-background/80 backdrop-blur px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <AnimatedThemeToggler />
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
      </DefaultContainer>
    </SidebarProvider>
  );
}
