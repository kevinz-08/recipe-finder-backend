import mongoose, { Schema, Document, Model } from "mongoose";

/* 1Interface del Documento */

export interface IToken extends Document {
  token: string;
}

/* Schema Tipado */

const TokenSchema: Schema<IToken> = new Schema<IToken>({
  token: { type: String, required: true },
});

/* Modelo */

const Token: Model<IToken> = mongoose.model<IToken>("Token", TokenSchema);

export default Token;