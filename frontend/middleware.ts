import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // Create Supabase client with proper cookie handling
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        // Set cookie in the response
        res.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        // Remove cookie by setting empty string with maxAge 0
        res.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  // Refresh session to ensure cookies are up to date
  let {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no user but we have cookies, try refreshing the session
  if (!user && !error) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Session exists, refresh to get user
      await supabase.auth.refreshSession();
      const { data: { user: refreshedUser } } = await supabase.auth.getUser();
      user = refreshedUser || null;
    }
  }

  const { pathname } = req.nextUrl;

  // Define route groups
  const protectedRoutes = ["/dashboard", "/problems", "/submissions"];
  const authRoutes = ["/login", "/signup"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from auth routes
  if (user && isAuthRoute) {
    // Check for redirect parameter in URL
    const redirectParam = req.nextUrl.searchParams.get("redirect");
    const redirectPath = redirectParam && redirectParam.startsWith("/") 
      ? redirectParam 
      : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
