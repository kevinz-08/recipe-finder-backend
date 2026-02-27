import jwt, { SignOptions } from "jsonwebtoken";

/* ============================= */
/* 1️⃣ Tipado del payload */
/* ============================= */

export interface JwtUserPayload {
  id: string;
  email: string;
  name: string;
}

interface JwtPayload {
  user: JwtUserPayload;
}

/* ============================= */
/* 2️⃣ Función interna para firmar */
/* ============================= */

function sign(payload: JwtPayload, isAccesToken: boolean): string {
  const secret = isAccesToken
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: isAccesToken ? "1h" : "7d",
  };

  return jwt.sign(payload, secret, options);
}

/* ============================= */
/* 3️⃣ Generadores públicos */
/* ============================= */

export function generateAccesToken(user: JwtUserPayload): string {
  return sign({ user }, true);
}

export function generateRefreshToken(user: JwtUserPayload): string {
  return sign({ user }, false);
}