import "./styles/tailwind.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "yoguhaeyo",
  description: "팀과 개발 문서를 한 곳에서, 빠르고 깔끔하게 😎",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
          {children}
          <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;