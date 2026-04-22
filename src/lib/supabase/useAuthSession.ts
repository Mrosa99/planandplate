"use client";

import { useAuth } from "./AuthProvider";

export function useAuthSession() {
  return useAuth();
}
