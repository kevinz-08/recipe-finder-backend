import { Router, Request, Response } from "express";
import getTokenFromHeader from "../auth/getTokenFromHeader";
import jsonresponse from "../lib/jsonresponse";
import Token from "../schema/token";

const router = Router();

router.delete("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = getTokenFromHeader(req.headers);

    if (!refreshToken) {
      return res.status(400).json(
        jsonresponse(400, {
          error: "Refresh token requerido",
        })
      );
    }

    await Token.findOneAndDelete({ token: refreshToken });

    return res.status(200).json(
      jsonresponse(200, {
        message: "Token eliminado correctamente",
      })
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json(
      jsonresponse(500, {
        error: "Server error",
      })
    );
  }
});

export default router;