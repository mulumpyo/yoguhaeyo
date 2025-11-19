"use client"

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./app-sidebar";
import { useAuth } from "@/providers/AuthProvider";

const findBreadcrumbInfo = (menu, pathname) => {
  const matches = [];

  for (const group of menu) {
    for (const item of group.items) {

      if (pathname.startsWith(item.url)) {
        matches.push({
          group: { title: group.title },
          parent: null,
          current: { title: item.title, url: item.url },
          len: item.url.length,
        });
      }

      if (item.items) {
        for (const sub of item.items) {
          if (pathname.startsWith(sub.url)) {
            matches.push({
              group: { title: group.title },
              parent: { title: item.title, url: item.url },
              current: { title: sub.title, url: sub.url },
              len: sub.url.length,
            });
          }
        }
      }
    }
  }

  if (matches.length === 0) return null;


  matches.sort((a, b) => b.len - a.len);

  return matches[0];
};


export const AppLayoutContent = ({ children }) => {
  const pathname = usePathname();
  const user = useAuth();
  const [menuData, setMenuData] = useState([]);

  const breadcrumb = useMemo(() => findBreadcrumbInfo(menuData, pathname), [menuData, pathname]);

  return (
    <SidebarProvider>
      <AppSidebar user={user} onMenuLoaded={setMenuData} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-gray-50">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>{breadcrumb.group.title}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />

                    {breadcrumb.parent && (
                      <>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink>{breadcrumb.parent.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </>
                    )}

                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumb.current.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>홈</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};