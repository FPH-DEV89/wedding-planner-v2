import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // les providers sont assemblés dans lib/auth.ts (Credentials a besoin de Node/bcrypt)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname
      const isProtected =
        pathname !== "/login" &&
        pathname !== "/" &&
        !pathname.startsWith("/api/auth") &&
        !pathname.startsWith("/_next")
      if (isProtected && !isLoggedIn) return false // → redirige vers pages.signIn = /login
      return true
    },
  },
} satisfies NextAuthConfig
