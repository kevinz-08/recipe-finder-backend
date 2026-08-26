import mongoose, { Schema, Document, Model } from "mongoose";

/* 1Interface del Documento */

export interface IToken extends Document {
  token: string;
  createdAt: Date;
}

/* Schema Tipado */

const TokenSchema: Schema<IToken> = new Schema<IToken>({
  token: { type: String, required: true, unique: true },
  // mismo tiempo de vida que el refresh token, para no acumular basura
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

/* Modelo */

const Token: Model<IToken> = mongoose.model<IToken>("Token", TokenSchema);

export default Token;