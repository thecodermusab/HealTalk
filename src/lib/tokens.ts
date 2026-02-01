import crypto from "crypto";

export type TokenPurpose = "verify" | "reset";

export const createToken = (purpose: TokenPurpose) =>
  `${purpose}_${crypto.randomBytes(32).toString("hex")}`;

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const buildIdentifier = (email: string, purpose: TokenPurpose) =>
  `${email}:${purpose}`;

export const parseIdentifier = (identifier: string) => {
  const [email, purpose] = identifier.split(":");
  return {
    email,
    purpose: purpose as TokenPurpose | undefined,
  };
};
