import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  if (searchParams.get("message")) {
    return NextResponse.redirect(`${origin}/settings`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );

  // PKCE flow
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (type === "recovery") return NextResponse.redirect(`${origin}/auth/reset-password`);
      if (type === "email_change") return NextResponse.redirect(`${origin}/settings`);
      return NextResponse.redirect(`${origin}/auth/login?confirmed=true`);
    }
  }

  // OTP flow
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      if (type === "recovery") return NextResponse.redirect(`${origin}/auth/reset-password`);
      if (type === "email_change") return NextResponse.redirect(`${origin}/settings`);
      return NextResponse.redirect(`${origin}/auth/login?confirmed=true`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
