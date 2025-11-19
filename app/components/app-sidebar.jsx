"use client"

import { useState, useEffect, memo } from "react";
import api from "@/lib/api";

import { NavMenu } from "@/components/nav-menu";
import { NavUser } from "@/components/nav-user";
import { ProjectSwitcher } from "@/components/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export const dummy = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    { name: "thisisme", description: "포트폴리오 플랫폼" },
    { name: "yoguhaeyo", description: "개발자 협업 도구" },
  ],
};

const AppSidebarComponent = ({ user, onMenuLoaded, ...props }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get("/api/menu/sidebar-menu");
        setMenu(data);

        onMenuLoaded?.(data);
      } catch (err) {
        setMenu([]);
        onMenuLoaded?.([]);
      }
    };

    fetchMenu();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={dummy.projects} />
      </SidebarHeader>

      <SidebarContent>
        {menu.map((group, idx) => (
          <NavMenu key={`${group.title}-${idx}`} group={group} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export const AppSidebar = memo(AppSidebarComponent);