import { Router, Request, Response } from "express";
import getTokenFromHeader from "../auth/getTokenFromHeader";
import jsonresponse from "../lib/jsonresponse";
import Token from "../schema/token";
import { generateAccesToken } from "../auth/generateTokens";
import { verifyRefreshToken } from "../auth/verifyToken";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<Response> => {
  const refreshToken = getTokenFromHeader(req.headers);

  if (!refreshToken) {
    return res
      .status(401)
      .json(jsonresponse(401, { error: "Unauthorized" }));
  }

  try {
    const found = await Token.findOne({ token: refreshToken });

    if (!found) {
      return res
        .status(401)
        .json(jsonresponse(401, { error: "Unauthorized" }));
    }

    const payload = verifyRefreshToken(found.token);

    if (!payload) {
      return res
        .status(401)
        .json(jsonresponse(401, { error: "Unauthorized" }));
    }

    const accessToken = generateAccesToken(payload.user);

    return res.status(200).json(
      jsonresponse(200, {
        accessToken,
      })
    );
  } catch (error) {
    return res
      .status(401)
      .json(jsonresponse(401, { error: "Unauthorized" }));
  }
});

export default router;