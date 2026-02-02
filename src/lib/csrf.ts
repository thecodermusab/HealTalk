import { NextResponse } from "next/server";
import crypto from "crypto";

const CSRF_COOKIE = "__healtalk_csrf";
const CSRF_HEADER = "x-csrf-token";

const getSecret = () =>
  process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || "dev-csrf-secret";
const shouldEnforce = () =>
  process.env.NODE_ENV === "production" && Boolean(process.env.CSRF_SECRET);

const hashToken = (token: string) =>
  crypto.createHmac("sha256", getSecret()).update(token).digest("hex");

export const ensureCsrfCookie = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const signed = `${token}.${hashToken(token)}`;
  const isSecure = process.env.NODE_ENV === "production";
  return NextResponse.json({ csrfToken: token }, {
    headers: {
      "Set-Cookie": `${CSRF_COOKIE}=${signed}; Path=/; HttpOnly; SameSite=Lax${isSecure ? "; Secure" : ""}`,
    },
  });
};

export const validateCsrf = (request: Request) => {
  if (!shouldEnforce()) return null;
  const headerToken = request.headers.get(CSRF_HEADER);
  if (!headerToken) {
    return NextResponse.json({ error: "Missing CSRF token" }, { status: 403 });
  }

  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`));
  if (!match) {
    return NextResponse.json({ error: "Missing CSRF cookie" }, { status: 403 });
  }

  const [raw, signature] = match[1].split(".");
  if (!raw || !signature) {
    return NextResponse.json({ error: "Invalid CSRF cookie" }, { status: 403 });
  }

  const expected = hashToken(raw);
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid CSRF cookie" }, { status: 403 });
  }

  if (headerToken !== raw) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  return null;
};

export const csrfCookieName = CSRF_COOKIE;
