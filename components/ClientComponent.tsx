"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function ClientComponent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.log("User doest't exist");
      } else {
        setUser(data?.user);
      }
    }
    getUser();
  }, []);

  console.log("data user =", user);

  return (
    <h2>{user?.user_metadata.username || user?.user_metadata?.user_name}</h2>
  );
}
