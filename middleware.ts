import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { securityMiddleware, logSecurityEvent } from "./lib/security";

const isProtectedRoute = createRouteMatcher(["/account(.*)"]);

export default clerkMiddleware((auth, request) => {
  const { pathname } = request.nextUrl;

  // Protect account routes
  if (isProtectedRoute(request)) {
    auth().protect();
  }

  // Admin route protection
  if (pathname.startsWith("/secure-admin") && pathname !== "/secure-admin/login") {
    const session = request.cookies.get("admin_session");
    if (!session) {
      logSecurityEvent("UNAUTHORIZED_ADMIN_ACCESS", { pathname }, request);
      return NextResponse.redirect(new URL("/secure-admin/login", request.url));
    }
  }

  // Apply security headers to all requests
  const response = securityMiddleware(request);

  // API route protection
  if (pathname.startsWith("/api/")) {
    // Add rate limiting headers
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", "99");
    response.headers.set("X-RateLimit-Reset", new Date(Date.now() + 900000).toISOString());
  }

  // File upload protection
  if (pathname.startsWith("/api/upload")) {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      logSecurityEvent("INVALID_UPLOAD_REQUEST", { contentType }, request);
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  }

  // HTTPS enforcement
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    return NextResponse.redirect(`https://${request.headers.get("host")}${pathname}`, 301);
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|map)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};