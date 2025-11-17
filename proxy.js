import { NextResponse } from "next/server";

const PROTECTED = ["/app"];
const AUTH_ONLY = ["/"];

const proxy = async (req) => {
  const { pathname, origin } = req.nextUrl;

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthPage = AUTH_ONLY.includes(pathname);

  let isLoggedIn = false;

  try {
    const me = await fetch(`${origin}/api/auth/me`, {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    });

    isLoggedIn = me.ok;
  } catch (_) {
    isLoggedIn = false;
  }

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};

export default proxy; 