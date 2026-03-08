import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("user_credits")
      .select("credits, is_unlimited")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setCredits(data.credits);
      setIsUnlimited(data.is_unlimited);
    } else {
      setCredits(0);
      setIsUnlimited(false);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  return { credits, isUnlimited, loading, refetch: fetchCredits };
}
