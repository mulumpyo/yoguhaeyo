import { NextResponse } from "next/server";

const PROTECTED = ["/app"];
const AUTH_ONLY = ["/"];

const proxy = (req) => {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  const accessToken = req.cookies.get("access_token")?.value ?? null;

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthPage = AUTH_ONLY.includes(pathname);

  const isLoggedIn = Boolean(accessToken);

  if (isProtected && !isLoggedIn) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && isLoggedIn) {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};

export default proxy;