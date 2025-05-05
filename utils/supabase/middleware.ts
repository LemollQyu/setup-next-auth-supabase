import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Mendapatkan user dari session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cek jika user sudah login dan mencoba mengakses halaman login/register
  const isAuthRequired = ![
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth",
  ].includes(request.nextUrl.pathname);

  // Jika user sudah login dan mencoba mengakses halaman login/register
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    // Redirect user ke halaman utama atau dashboard
    const url = request.nextUrl.clone();
    url.pathname = "/"; // Ganti dengan halaman yang sesuai setelah login
    return NextResponse.redirect(url);
  }

  // Jika user belum login dan mencoba mengakses halaman yang membutuhkan login
  if (!user && isAuthRequired) {
    const url = request.nextUrl.clone();
    url.pathname = "/login"; // Redirect ke halaman login
    return NextResponse.redirect(url);
  }

  // Mengembalikan response dengan cookie yang disetel
  return supabaseResponse;
}
