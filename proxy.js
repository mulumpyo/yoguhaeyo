import { NextResponse } from "next/server";

const PROTECTED = ["/app"];

const proxy = async (req) => {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  const accessToken = req.cookies.get("access_token")?.value ?? null;
  const refreshToken = req.cookies.get("refresh_token")?.value ?? null;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (!accessToken && refreshToken) {
    try {
      const apiRes = await fetch(`${process.env.BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          cookie: req.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      });

      if (!apiRes.ok) {
        url.pathname = "/";
        const response = NextResponse.redirect(url);

        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        
        return response;
      }

      const response = NextResponse.redirect(new URL(pathname, req.url));

      apiRes.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          response.headers.append("set-cookie", value);
        }
      });

      return response;

    } catch (err) {
      console.error("Middleware Refresh Error:", err);
      url.pathname = "/";
      const response = NextResponse.redirect(url);
      
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      
      return response;
    }
  }

  const isLoggedIn = Boolean(accessToken);

  if (isProtected && !isLoggedIn) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && pathname === "/") {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/app/:path*"],
};

export default proxy;