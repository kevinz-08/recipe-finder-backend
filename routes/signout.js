const getTokenFromHeader = require('../auth/getTokenFromHeader');
const jsonresponse  = require('../lib/jsonresponse');
const Token = require('../schema/token');
const router = require("express").Router();

router.delete("/", async (req, res) => {
  try {
    const refreshToken = getTokenFromHeader(req.headers);

    if (!refreshToken) {
      return res
        .status(400)
        .json(jsonresponse(400, { error: "Refresh token requerido" }));
    }

    await Token.findOneAndDelete({ token: refreshToken });

    return res
      .status(200)
      .json(jsonresponse(200, { message: "Token eliminado correctamente" }));

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(jsonresponse(500, { error: "Server error" }));
  }
});

module.exports = router;