// Validates a Bearer token from the Authorization header
// Returns the Supabase user or throws
// Used by every protected API route

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getUserFromBearerToken(req: Request) {
  const token = req.headers
    .get("authorization")
    ?.replace("Bearer ", "")
    .trim();

  if (!token) throw new Error("UNAUTHORIZED");

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) throw new Error("UNAUTHORIZED");

  return data.user;
}