import { NextResponse } from "next/server";

const protectedRoutes = ["/app"];

const proxy = (req) => {
  const { pathname } = req.nextUrl;

  // 비보호 경로
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // JWT 쿠키 확인
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    // 로그인 안 됨 => 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 로그인 됨 => 요청 계속
  return NextResponse.next();
};

export const config = {
  matcher: ["/app/:path*"],
};

export default proxy;