import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });

          response = NextResponse.next({
            request,
          });

          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });

          response = NextResponse.next({
            request,
          });

          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

 const {
  data: { user },
} = await supabase.auth.getUser();

// Protect only admin routes
if (request.nextUrl.pathname.startsWith("/admin")) {
  // Allow login page
  if (request.nextUrl.pathname === "/admin/login") {
    return response;
  }

  // Not logged in
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Check admin table
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("auth_id", user.id)
    .eq("status", "active")
    .single();

  if (!admin) {
    await supabase.auth.signOut();

    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }
}

return response;

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};