import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const EXPIRES = process.env.JWT_EXPIRES_IN ?? "7d";

export type JwtPayload = {
  id: string;
  role: "user" | "admin" | "company";
};

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, SECRET) as JwtPayload;
