export const githubProvider = {

  getAccessToken: async (app, req) => {
    const tokenResponse = await app.github.getAccessTokenFromAuthorizationCodeFlow(req);
    return tokenResponse?.token?.access_token;
  },

  getUserInfo: async (accessToken) => {
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) throw { status: 502, message: "GitHub API error" };
    return response.json();
  }
  
};