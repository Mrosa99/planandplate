"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setUser(null);
        console.log("User is NOT logged in");
        router.push("/login"); // redirect if not logged in
      } else {
        setUser(data.session.user);
        console.log("User IS logged in:", data.session.user.email);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("Signed out successfully");
      setUser(null);
      router.push("/login"); // redirect to login after logout
    }
  };

  if (loading) return <p>Checking login status...</p>;

  return (
    <div>
      <h1>Categories</h1>
      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
