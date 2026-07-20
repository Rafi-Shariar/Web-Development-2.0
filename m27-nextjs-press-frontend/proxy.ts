import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = ["/", "/news", "/login", "/register"];
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("Pathname: ", pathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const decodedToken = accessToken
    ? (jwt.decode(accessToken) as JwtPayload)
    : null;

  let userRole = null;

  if (decodedToken) {
    userRole = decodedToken.role;
  }

  //user is logged in but trying to access login/register page
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL("/author-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }


  //Protecting Routes which can not be accessed without authentication. Authorization not done
  const isPublic = PUBLIC_ROUTES.some((route)=> pathname === route || pathname.startsWith(route + '/'))

  if(!accessToken && !isPublic){
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //Authorization of routes

  if(pathname.startsWith('/dashboard') && userRole !=="USER"){
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  else if(pathname.startsWith('/admin-dashboard') && userRole !=="ADMIN"){
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  else if(pathname.startsWith('/author-dashboard') && userRole !=="AUTHOR"){
    return NextResponse.redirect(new URL("/not-found", request.url));
  }





 


  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/dashboard/:path*',
    // '/admin-dashboard/:path*',
    // '/author-dashbaord/:path*'
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
