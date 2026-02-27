import { Router, Request, Response } from "express";
import jsonresponse from "../lib/jsonresponse";
import User from "../schema/user";

const router = Router();

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

router.post(
  "/",
  async (
    req: Request<{}, {}, RegisterBody>,
    res: Response
  ): Promise<Response> => {
    const { name, email, password, confirmPassword } = req.body;

    // Validación de campos requeridos
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json(
        jsonresponse(400, {
          error: "Fields are required",
        })
      );
    }

    // Validación de contraseña
    if (password !== confirmPassword) {
      return res.status(400).json(
        jsonresponse(400, {
          error: "Passwords do not match",
        })
      );
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json(
          jsonresponse(400, {
            error: "User already exists",
          })
        );
      }

      const newUser = new User({ name, email, password });
      await newUser.save();

      return res.status(201).json(
        jsonresponse(201, {
          message: "User Created Successfully",
        })
      );

    } catch (error: unknown) {

      // Narrowing seguro del error
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: number }).code === 11000
      ) {
        return res.status(400).json(
          jsonresponse(400, {
            error: "Email already exists",
          })
        );
      }

      return res.status(500).json(
        jsonresponse(500, {
          error: "User could not be created",
        })
      );
    }
  }
);

export default router;