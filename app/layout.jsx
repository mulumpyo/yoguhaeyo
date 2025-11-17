import "./styles/tailwind.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Yoguhaeyo",
  description: "Next.js App Router (SSR + CSR)",
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