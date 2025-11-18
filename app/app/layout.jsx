import { AuthProvider } from "@/providers/AuthProvider";
import { AppLayoutContent } from "@/components/app-layout-content";

const AppLayout = ({ children }) => {
  return (
    <AuthProvider>
      <AppLayoutContent>
        {children}
      </AppLayoutContent>
    </AuthProvider>
  );
};

export default AppLayout;