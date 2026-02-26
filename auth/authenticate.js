const jsonresponse = require("../lib/jsonresponse");
const getTokenFromHeader = require("./getTokenFromHeader");
const { verifyAccessToken } = require("./verifyToken");

function authenticate(req, res, next) {
  const token = getTokenFromHeader(req.headers);

  if (token) {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      req.user = { ...decoded.user };
      next();
    } else {
      res.status(401).json(
        jsonresponse(401, {
          message: "No token Provided",
        }),
      );
    }
  } else {
    res.status(401).json(
      jsonresponse(401, {
        message: "No token Provided",
      }),
    );
  }
}

module.exports = authenticate;
