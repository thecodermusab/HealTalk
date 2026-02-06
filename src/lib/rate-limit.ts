import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

const limiterCache = new Map<string, Ratelimit>();

// Parse duration string (e.g., "1 m", "1 h", "10 s") to Duration type
const parseDuration = (duration: string): `${number} ms` | `${number} s` | `${number} m` | `${number} h` | `${number} d` => {
  const parts = duration.trim().split(/\s+/);
  if (parts.length !== 2) return "60000 ms" as const; // default to 1 minute

  const value = parseInt(parts[0] || "60", 10);
  const unit = parts[1]?.toLowerCase();

  switch (unit) {
    case "s":
    case "sec":
    case "second":
    case "seconds":
      return `${value * 1000} ms` as const;
    case "m":
    case "min":
    case "minute":
    case "minutes":
      return `${value * 60 * 1000} ms` as const;
    case "h":
    case "hr":
    case "hour":
    case "hours":
      return `${value * 60 * 60 * 1000} ms` as const;
    case "d":
    case "day":
    case "days":
      return `${value * 24 * 60 * 60 * 1000} ms` as const;
    default:
      return "60000 ms" as const; // default to 1 minute
  }
};

const getLimiter = (limit: number, window: string) => {
  if (!redis) return null;
  const key = `${limit}:${window}`;
  if (!limiterCache.has(key)) {
    limiterCache.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, parseDuration(window)),
        analytics: true,
      })
    );
  }
  return limiterCache.get(key) || null;
};

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  return realIp || "unknown";
};

export const requireRateLimit = async (options: {
  request: Request;
  key: string;
  limit: number;
  window: string;
}) => {
  const limiter = getLimiter(options.limit, options.window);
  if (!limiter) return null;

  const ip = getClientIp(options.request);
  const result = await limiter.limit(`${options.key}:${ip}`);

  if (result.success) return null;

  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
      },
    }
  );
};
