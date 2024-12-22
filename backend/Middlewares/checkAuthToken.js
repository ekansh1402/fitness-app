const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  const authToken = req.cookies.authToken;

  console.log("Check Auth Token MIDDLEWARE CALLED", authToken);

  if (!authToken) {
    return res.status(401).json({
      message: "Authentication failed: No authToken  provided",
      ok: false,
    });
  }

  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Auth token has expired, check the refresh token
      // Both tokens are invalid, send an error message and prompt for login
      return res.status(401).json({
        message: "Authentication failed: Both tokens are invalid",
        ok: false,
      });
    } else {
      // Auth token is valid, continue with the request
      req.userId = decoded.userId;
      next();
    }
  });
}

module.exports = checkAuth;
