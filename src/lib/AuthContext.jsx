"use client";
import { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // SessionProvider is in Providers.jsx, this is just a compat wrapper
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.name || session.user.email?.split("@")[0] || "User",
        role: session.user.role || "user",
        department: "Community Outage Tracker",
        verified: true,
        image: session.user.image,
      }
    : null;

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoadingAuth: status === "loading",
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: null,
    authChecked: status !== "loading",
    updateUser: async (data) => {
      try {
        await fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (e) {
        console.warn("Failed to update user", e);
      }
    },
    login: async (email, password) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
      }
      if (!result?.ok) throw new Error("Invalid email or password");
      return result;
    },
    register: async ({ name, email, password }) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        let detail = "Registration failed";
        try { detail = (await res.json()).error || detail; } catch (_) {}
        throw new Error(detail);
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        throw new Error(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
      }
      if (!result?.ok) throw new Error("Registration failed");
      return result;
    },
    logout: async () => {
      const origin = typeof window !== "undefined" ? window.location.origin : undefined;
      await signOut({ callbackUrl: origin ? `${origin}/login` : "/login" });
    },
    navigateToLogin: () => router.push("/login"),
    checkUserAuth: async () => {},
    checkAppState: async () => {},
  };
};
