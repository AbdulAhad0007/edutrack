// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/attendance/:path*",
    "/marks/:path*",
    "/timetable/:path*",
    "/grades/:path*",
    "/exams/:path*",
    "/fees/:path*",
    "/analytics/:path*"
  ]
};