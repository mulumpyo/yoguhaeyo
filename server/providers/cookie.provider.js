export const cookieProvider = {

  setAuthCookies: (reply, accessToken, refreshToken, isProd) => {
    reply
      .setCookie("access_token", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "Strict" : "Lax",
        path: "/",
        maxAge: 60 * 60,
      })
      .setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "Strict" : "Lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
  }
  
};