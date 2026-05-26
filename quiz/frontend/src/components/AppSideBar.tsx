import { LogOut, type LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Logo } from "./Logo";
import LinkComponent from "./Link";
import { useLocation } from "react-router-dom";
import { USERAUTHAPI } from "@/api/auth";
import Cookies from "js-cookie";
import { removeUser } from "@/libs/storage";
import { useAuthStore } from "@/store/authStore/authStore";
import { motion } from "framer-motion";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface AppSidebarProps {
  label: string;
  items: NavItem[];
}

export function AppSidebar({ label, items }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (url: string) =>
    currentPath === url || currentPath.startsWith(url + "/");

  const { mutate: logout } = USERAUTHAPI.useUserLogout();

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((c) => Cookies.remove(c));
    localStorage.clear();
    removeUser();
    logout();
    useAuthStore.getState().resetAuth();
    window.location.href = "/";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs tracking-widest uppercase text-muted-foreground">
            {label}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, i) => {
                const active = isActive(item.url);

                return (
                  <motion.div
                    key={item.url}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={active}>
                        <LinkComponent
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <item.icon
                            className={`h-4 w-4 transition ${
                              active ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <span className="transition">{item.title}</span>
                        </LinkComponent>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
