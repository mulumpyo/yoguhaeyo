"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  MoreVertical,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const NavUser = ({ user }) => {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [prevUser, setPrevUser] = useState(user);

  useEffect(() => {
    if (user) {
      setPrevUser(user);
    }
  }, [user]);

  const currentUser = prevUser;

  if (!currentUser) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`@${currentUser.githubId}`);
    toast.success("사용자 번호가 클립보드에 복사되었어요 :)");
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer hover:bg-accent transition-colors duration-200"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                <AvatarFallback className="rounded-lg" />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentUser.username}</span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                  <AvatarFallback className="rounded-lg" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{currentUser.username}</span>
                  <span
                    className="truncate text-xs cursor-pointer text-gray-500 hover:text-accent-foreground transition-colors duration-200"
                    onClick={handleCopy}
                  >
                    @{currentUser.githubId}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                알림
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                설정
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export { NavUser };