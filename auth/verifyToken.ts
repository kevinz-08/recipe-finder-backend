import jwt, { JwtPayload } from "jsonwebtoken";

interface AccessTokenPayload extends JwtPayload {
  user: {
    id: string;
    email: string;
  };
}

export const verifyAccessToken = (
  token: string
): AccessTokenPayload | null => {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET not defined");
    }

    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as AccessTokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (
  token: string
): JwtPayload | null => {
  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET not defined");
    }

    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    ) as JwtPayload;
  } catch (error) {
    return null;
  }
};