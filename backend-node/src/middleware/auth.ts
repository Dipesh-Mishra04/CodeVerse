import type { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";
import { supabaseAnon } from "../lib/supabase.js";

export type AuthedRequest = Request & { user?: User | null };

export async function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    req.user = null;
    return next();
  }
  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    req.user = null;
    return next();
  }
  req.user = data.user;
  next();
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  req.user = data.user;
  next();
}
