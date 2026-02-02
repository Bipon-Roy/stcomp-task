import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl;
   const cookieStore = req.cookies;
   const accessToken = cookieStore.get("accessToken")?.value;

   const hasAccessToken = Boolean(accessToken);

   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      if (!hasAccessToken) {
         const redirectUrl = new URL("/signin", req.url);
         redirectUrl.searchParams.set("message", "You are not authorized to access this page");
         return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.next();
   }

   return NextResponse.next();
}

// Exclude Next.js internal routes and API routes
export const config = {
   matcher: [
      /*
       * Match all request paths except:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - public folder
       * - API routes that might use Server Actions
       */
      "/((?!_next/static|_next/image|_next/data|favicon.ico|api).*)",
      "/profile/:path*",
      "/admin/:path*",
      "/auth/:path*",
   ],
};
