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
          error: userError,
        } = await supabase.auth.getUser();
        
        if (userError) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(user);

        if (user) {
          try {
            const profileResult = await getProfile(user.id);
            if (profileResult.success && profileResult.data) {
              setProfile(profileResult.data);
            } else {
              // Profile might not exist yet (e.g., just signed up)
              // This is okay, we'll show user info from auth.user
              setProfile(null);
            }
          } catch (profileError) {
            // Profile fetch failed, but we still have user
            setProfile(null);
          }
        } else {
          setProfile(null);
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
      try {
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const profileResult = await getProfile(session.user.id);
            if (profileResult.success && profileResult.data) {
              setProfile(profileResult.data);
            } else {
              setProfile(null);
            }
          } catch (profileError) {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
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
