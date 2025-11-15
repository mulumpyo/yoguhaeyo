import "./styles/tailwind.css";

export const metadata = {
  title: "Yoguhaeyo",
  description: "Next.js App Router (SSR + CSR)",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white shadow-sm">
          <nav className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-bold text-indigo-600">Yoguhaeyo</h1>
            <ul className="flex gap-4 text-sm font-medium">
              <li><a href="/" className="hover:text-indigo-500">홈 (SSR)</a></li>
              <li><a href="/app" className="hover:text-indigo-500">앱 (CSR)</a></li>
              <li><a href="/test" className="hover:text-indigo-500">토큰 테스트</a></li>
            </ul>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;