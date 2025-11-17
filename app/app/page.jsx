"use client";

import { AppLayout } from "@/components/app-layout";
import { useAuth } from "@/hooks/useAuth";

const AppPage = () => {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <AppLayout user={user} pageTitle="대시보드">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
    </AppLayout>
  );
};

export default AppPage;