import mongoose, { Schema, Document, Model } from "mongoose";

/* ============================= */
/* 1️⃣ Interface del Documento */
/* ============================= */

export interface IToken extends Document {
  token: string;
}

/* ============================= */
/* 2️⃣ Schema Tipado */
/* ============================= */

const TokenSchema: Schema<IToken> = new Schema<IToken>({
  token: { type: String, required: true },
});

/* ============================= */
/* 3️⃣ Modelo */
/* ============================= */

const Token: Model<IToken> = mongoose.model<IToken>("Token", TokenSchema);

export default Token;