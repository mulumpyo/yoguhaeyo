"use client"

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AppSidebar, dummy } from "./app-sidebar";
import { useAuth } from "@/providers/AuthProvider";

export const AppLayoutContent = ({ children }) => {
  const pathname = usePathname();
  const user = useAuth();

  const findPageTitle = () => {
    const exactMatch = dummy.navMain.find((item) => item.url === pathname);
    if (exactMatch) return exactMatch.title;

    const partialMatch = dummmy.navMain.find(
      (item) => pathname.startsWith(item.url) && item.url !== "#"
    );
    if (partialMatch) return partialMatch.title;

    return "페이지";
  };

  const pageTitle = findPageTitle();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-gray-50">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>홈</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
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
}