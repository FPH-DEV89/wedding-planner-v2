import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin)
    return NextResponse.redirect(signInUrl)
  }
})

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|~offline|icons|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
}
