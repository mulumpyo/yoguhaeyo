"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

const NavMenu = ({ group }) => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

      <SidebarMenu>
        {group.items.map((item) => {
          const Icon = getIcon(item.icon_name);
          const isActive =
            item.url === pathname ||
            item.items?.some((sub) => sub.url === pathname);

          const hasChildren = item.items && item.items.length > 0;

          return hasChildren ? (
            <Collapsible
              key={item.menu_id}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={isActive ? "bg-accent text-accent-foreground" : ""}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((sub) => {
                      const SubIcon = getIcon(sub.icon_name);
                      const isSubActive = sub.url === pathname;

                      return (
                        <SidebarMenuSubItem key={sub.menu_id}>
                          <SidebarMenuSubButton
                            asChild
                            className={
                              isSubActive ? "bg-accent text-accent-foreground" : ""
                            }
                          >
                            <Link href={sub.url} onClick={handleLinkClick}>
                              {SubIcon && <SubIcon className="mr-2 h-4 w-4" />}
                              {sub.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.menu_id}>
              <SidebarMenuButton
                asChild
                className={isActive ? "bg-accent text-accent-foreground" : ""}
              >
                <Link href={item.url || pathname} onClick={handleLinkClick}>
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { NavMenu };