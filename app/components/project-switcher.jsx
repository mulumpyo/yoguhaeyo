"use client"

import * as React from "react";
import { Frame, ChevronsUpDown, ChevronRight, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const ProjectSwitcher = ({
  projects
}) => {
  const { isMobile } = useSidebar();
  const [activeProject, setActiveProject] = React.useState(projects[0]);

  if (!activeProject) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Frame className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeProject.name}
                </span>
                <span className="truncate text-xs">{activeProject.description}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              진행 중인 프로젝트
            </DropdownMenuLabel>
            {projects.map((project, index) => (
              <DropdownMenuItem key={project.name} onClick={() => setActiveProject(project)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Frame className="size-4 shrink-0" />
                </div>
                {project.name}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
              <DropdownMenuItem
                onClick={() => router.push("/app/projects")}
                className="gap-2 p-2 justify-center"
              >
                <span className="font-medium items-center gap-2 text-muted-foreground">
                  전체 프로젝트 보기
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div
                className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">프로젝트 생성</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export { ProjectSwitcher };