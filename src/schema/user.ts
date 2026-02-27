import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import { generateAccesToken, generateRefreshToken } from "../auth/generateTokens";
import getUserInfo from "../lib/getUserInfo";
import Token from "./token";

/* ============================= */
/* 1️⃣  Interface del Documento */
/* ============================= */

export interface IUser {
  name: string;
  email: string;
  password: string;

  comparePassword(password: string): Promise<boolean>;
  createAccesToken(): string;
  createRefreshToken(): Promise<string | undefined>;
}

export type UserDocument = HydratedDocument<IUser>;

/* ============================= */
/* 2️⃣  Schema */
/* ============================= */

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
});

/* ============================= */
/* 3️⃣  Middleware pre-save */
/* ============================= */

UserSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ============================= */
/* 4️⃣  Métodos personalizados */
/* ============================= */

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.createAccesToken = function (
  this: UserDocument
): string {
  return generateAccesToken(getUserInfo(this));
};

UserSchema.methods.createRefreshToken = async function (
  this: UserDocument
): Promise<string | undefined> {
  const refreshToken = generateRefreshToken(getUserInfo(this));

  try {
    await new Token({ token: refreshToken }).save();
    return refreshToken;
  } catch (error) {
    console.error(error);
  }
};

/* ============================= */
/* 5️⃣  Modelo */
/* ============================= */

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;