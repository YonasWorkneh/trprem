"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types/auth";
import { getProfile } from "../services/authService";
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  isStoredAuthValid,
} from "../utils/authStorage";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isInitializedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load from localStorage immediately for instant UI
    const stored = getStoredAuth();
    if (stored.user && isStoredAuthValid()) {
      setUser(stored.user as User);
      if (stored.profile) {
        setProfile(stored.profile as Profile);
      }
      setLoading(false);
      isInitializedRef.current = true;
    }

    const verifyAndUpdateAuth = async () => {
      // Get stored data for fallback
      const storedData = getStoredAuth();
      
      try {
        // Set a timeout to prevent infinite loading
        timeoutRef.current = setTimeout(() => {
          if (!isInitializedRef.current) {
            setLoading(false);
            isInitializedRef.current = true;
          }
        }, 2000); // Max 2 seconds for auth check

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (userError || !currentUser) {
          setUser(null);
          setProfile(null);
          clearStoredAuth();
          setLoading(false);
          isInitializedRef.current = true;
          return;
        }

        // Get session for token
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(currentUser);

        // Store user in localStorage
        if (session) {
          setStoredAuth(
            session.access_token,
            {
              id: currentUser.id,
              email: currentUser.email || undefined,
              phone: currentUser.phone || undefined,
            },
            null
          );
        }

        // Fetch profile (with cached fallback)
        try {
          const profileResult = await getProfile(currentUser.id);
          if (profileResult.success && profileResult.data) {
            setProfile(profileResult.data);
            if (session) {
              setStoredAuth(
                session.access_token,
                {
                  id: currentUser.id,
                  email: currentUser.email || undefined,
                  phone: currentUser.phone || undefined,
                },
                profileResult.data
              );
            }
          } else {
            // Use cached profile if available
            if (storedData.profile && storedData.profile.id === currentUser.id) {
              setProfile(storedData.profile as Profile);
            } else {
              setProfile(null);
            }
          }
        } catch {
          // Use cached profile if available
          if (storedData.profile && storedData.profile.id === currentUser.id) {
            setProfile(storedData.profile as Profile);
          } else {
            setProfile(null);
          }
        }
      } catch {
        // On error, use cached data if available
        if (storedData.user && isStoredAuthValid()) {
          setUser(storedData.user as User);
          if (storedData.profile) {
            setProfile(storedData.profile as Profile);
          }
        } else {
          setUser(null);
          setProfile(null);
          clearStoredAuth();
        }
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setLoading(false);
        isInitializedRef.current = true;
      }
    };

    // Verify auth in background
    verifyAndUpdateAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          setUser(session.user);
          setStoredAuth(
            session.access_token,
            {
              id: session.user.id,
              email: session.user.email || undefined,
              phone: session.user.phone || undefined,
            },
            null
          );

          // Fetch profile in background
          const profileResult = await getProfile(session.user.id);
          if (profileResult.success && profileResult.data) {
            setProfile(profileResult.data);
            setStoredAuth(
              session.access_token,
              {
                id: session.user.id,
                email: session.user.email || undefined,
                phone: session.user.phone || undefined,
              },
              profileResult.data
            );
          }
        } else {
          setUser(null);
          setProfile(null);
          clearStoredAuth();
        }
      } catch {
        setUser(null);
        setProfile(null);
        clearStoredAuth();
      }
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
