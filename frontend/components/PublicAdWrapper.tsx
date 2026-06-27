"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Adsterra from "./Adsterra";

export default function PublicAdWrapper() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    setMounted(true);

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  if (!mounted || loading) return null;

  // Do not show ads for logged in users
  if (user) return null;

  // Paths that explicitly should NOT show ads (e.g. login, signup)
  const forbiddenPaths = ["/login", "/signup", "/auth"];
  
  const isForbiddenPath = forbiddenPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isForbiddenPath) return null;

  // If it's a public page and the user is NOT authenticated, show the ad
  return <Adsterra />;
}
