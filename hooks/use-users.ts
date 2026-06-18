"use client";
import { useState, useEffect, useCallback } from "react";
import { usersService } from "../services/users.service";
import { useAuthStore } from "../store/auth.store";
import type { User } from "../types";

export function useUsers() {
  const { token } = useAuthStore();
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await usersService.getAll(token);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}