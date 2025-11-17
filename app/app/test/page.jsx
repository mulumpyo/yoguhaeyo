"use client";

import { AppLayout } from "@/components/app-layout";
import { useAuth } from "@/hooks/useAuth";

const TestPage = () => {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <AppLayout user={user} pageTitle="테스트">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <h1>테스트 중입니다.</h1>
      </div>
    </AppLayout>
  );
};

export default TestPage;