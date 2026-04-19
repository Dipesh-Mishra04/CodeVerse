// Avoid `next/server` here: its barrel loads ua-parser-js, which references `__dirname` and breaks Edge (Vercel).
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import type { NextRequest } from "next/dist/server/web/spec-extension/request";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.match(/\.(js|css|png|jpg|ico|woff|svg|json|webp)$/i)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedRoutes = [
    "/dashboard",
    "/onboarding",
    "/analytics",
    "/settings",
    "/tutor",
    "/admin",
  ];
  const authRoutes = ["/login", "/signup"];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const cleanRedirectUrl = req.nextUrl.clone();
    cleanRedirectUrl.pathname = "/dashboard";
    cleanRedirectUrl.search = "";
    cleanRedirectUrl.hash = "";
    return NextResponse.redirect(cleanRedirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
