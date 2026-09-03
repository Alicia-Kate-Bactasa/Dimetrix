export const authConfig = {
  trustHost: true,
  // Auth.js v5 reads AUTH_SECRET; older docs / Vercel projects often still set
  // NEXTAUTH_SECRET. Support both so the signing secret is identical between
  // the auth handler and the middleware — a mismatch makes every session
  // unverifiable and users bounce straight back to /login after signing in.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
