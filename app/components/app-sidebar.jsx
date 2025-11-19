"use client"

import { useState, useEffect, memo } from "react";
import api from "@/lib/api";

import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
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
  navMain: [
    { title: "대시보드", url: "/app", icon: SquareTerminal },
    { title: "테스트", url: "/app/test", icon: Bot },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     { title: "Introduction", url: "#" },
    //     { title: "Get Started", url: "#" },
    //     { title: "Tutorials", url: "#" },
    //     { title: "Changelog", url: "#" },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     { title: "General", url: "#" },
    //     { title: "Team", url: "#" },
    //     { title: "Billing", url: "#" },
    //     { title: "Limits", url: "#" },
    //   ],
    // },
  ],
  project_menu: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
};

const AppSidebarComponent = ({ user, ...props }) => {

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get("/api/menu/sidebar-menu");
        setMenu(data);
      } catch (err) {
        setMenu([]);
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
        <NavMain items={menu} />
        {/* <NavProjects projects={data.project_menu} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export const AppSidebar = memo(AppSidebarComponent);