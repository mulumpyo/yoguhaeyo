export const jwtProvider = {

  signAccessToken: (app, payload) => {
    return app.jwt.sign(payload, { expiresIn: "1h" });
  }
  
};