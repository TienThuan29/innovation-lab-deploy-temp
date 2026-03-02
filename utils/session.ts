import type { Role } from "@/types/user";

export type SessionData = {
  id: string;
  email: string;
  fullname: string;
  role: Role;
  labId: string;
  avartarUrl?: string;
};

const STORAGE_KEY = "ilabs.session";

export const getStoredSession = (): SessionData | null => {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch (_err) {
    return null;
  }
};

export const setStoredSession = (
  session: SessionData,
  remember: boolean,
): void => {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(session);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, serialized);
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (_err) {
    // Ignore storage errors for now
  }
};

export const clearStoredSession = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (_err) {
    // Ignore storage errors for now
  }
};
