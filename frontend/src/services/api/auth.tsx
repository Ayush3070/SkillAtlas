/**
 * Frontend-only mock authentication. The real auth layer (OIDC, SAML, etc.)
 * can replace this later without UI changes.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "Government Administrator" | "Training Institute" | "Employer" | "Candidate";

export interface User {
  id: string;
  name: string;
  role: Role;
  organization: string;
  districtId?: string;
}

const DEFAULT_USER: User = {
  id: "u-001",
  name: "A. Kulkarni",
  role: "Government Administrator",
  organization: "Maharashtra State Skill Development Society",
  districtId: "pune",
};

interface AuthContextValue {
  user: User;
  isAuthenticated: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "skillpulse:user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: true,
    signIn: (role) => setUser({ ...DEFAULT_USER, role }),
    signOut: () => setUser({ ...DEFAULT_USER, name: "Guest", organization: "—", role: "Candidate" }),
    switchRole: (role) => setUser((u) => ({ ...u, role })),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
