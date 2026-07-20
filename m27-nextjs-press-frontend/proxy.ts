import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./utils/jwt";
import { cookies } from "next/headers";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = ["/", "/news", "/login", "/register"];


export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("Pathname: ", pathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const decodedToken = await (accessToken
    ? jwtUtils.varifyToken(accessToken, process.env.JWT_ACCESS_SCRETE as string)
    : null);

  let userRole = null;

  //access token expired!
  if(!decodedToken?.success){
    const cookieStore = await cookies();
    cookieStore.delete("accessToken")
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (decodedToken?.success && decodedToken.data) {
    userRole = (decodedToken.data as JwtPayload).role;
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
