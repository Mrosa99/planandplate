"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabase-client";
import { fetchProfile } from "@/lib/supabase/profile";
import { Logout } from "@/lib/supabase/user-auth";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;

type AuthContextValue = {
  session: Session | null;
  avatar: string | null;
  refreshProfile: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  avatar: null,
  refreshProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const refreshProfile = useCallback(() => {
    if (!session?.user.id) return;
    fetchProfile(session.user.id)
      .then((data) => setAvatar(data.avatar ?? null))
      .catch(() => {});
  }, [session?.user.id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user.id) { setAvatar(null); return; }
    fetchProfile(session.user.id)
      .then((data) => setAvatar(data.avatar ?? null))
      .catch(() => {});
  }, [session?.user.id]);

  useEffect(() => {
    if (!session) return;

    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await Logout();
        toast.info("You were logged out due to inactivity");
      }, INACTIVITY_TIMEOUT);
    };

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [session?.user.id]);

  return (
    <AuthContext.Provider value={{ session, avatar, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
