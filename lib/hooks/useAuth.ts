"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types/auth";
import { getProfile } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const profileResult = await getProfile(user.id);
          if (profileResult.success && profileResult.data) {
            setProfile(profileResult.data);
          }
        }
      } catch (error) {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const profileResult = await getProfile(session.user.id);
        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isAuthenticated: !!user,
    loading,
  };
}
