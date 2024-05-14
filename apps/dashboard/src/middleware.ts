import { updateSession } from "@hr-toolkit/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // update user's auth session
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;
  return NextResponse.next({
    ...response,
    headers: {
      ...response.headers,
      "x-pathname": pathname,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
