import { Router, Request, Response } from "express";
import jsonresponse from "../lib/jsonresponse";
import User from "../schema/user";
import getUserInfo from "../lib/getUserInfo";

const router = Router();

interface LoginBody {
  email: string;
  password: string;
}

router.post(
  "/",
  async (
    req: Request<{}, {}, LoginBody>,
    res: Response
  ): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        jsonresponse(400, {
          error: "Fields are required",
        })
      );
    }

    try {
      const user = await User.findOne({ email });

      // 🔐 mensaje genérico para evitar user enumeration
      if (!user) {
        return res.status(400).json(
          jsonresponse(400, {
            error: "Invalid credentials",
          })
        );
      }

      const correctPassword = await user.comparePassword(password);

      if (!correctPassword) {
        return res.status(400).json(
          jsonresponse(400, {
            error: "Invalid credentials",
          })
        );
      }

      // ✅ Generación de tokens
      const accessToken = user.createAccesToken();
      const refreshToken = await user.createRefreshToken();

      return res.status(200).json(
        jsonresponse(200, {
          user: getUserInfo(user),
          accessToken,
          refreshToken,
        })
      );
    } catch (error) {
      return res.status(500).json(
        jsonresponse(500, {
          error: "Login failed",
        })
      );
    }
  }
);

export default router;