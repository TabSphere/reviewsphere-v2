import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSessionAndGuard(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 🔥 CRITICAL FIX — use getSession NOT getUser
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  const pathname = request.nextUrl.pathname;

  const protectedPaths = ["/dashboard", "/upgrade"];
  const isProtected = protectedPaths.some((p) =>
    pathname.startsWith(p)
  );

  const authPaths = ["/login", "/signup"];
  const isAuthPage = authPaths.some((p) =>
    pathname.startsWith(p)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}