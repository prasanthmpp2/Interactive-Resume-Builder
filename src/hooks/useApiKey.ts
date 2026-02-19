import { useMemo, useState } from "react";

const STORAGE_KEY = "irb-hf-key";

const readLocalKey = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch (_error) {
    return "";
  }
};

export const useApiKey = () => {
  const envKey = useMemo(
    () => import.meta.env.VITE_HF_API_KEY || import.meta.env.VITE_HF_TOKEN || "",
    []
  );
  const [localKey, setLocalKey] = useState(() => readLocalKey());

  const saveKey = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch (_error) {
      // Ignore storage errors.
    }
    setLocalKey(trimmed);
  };

  const clearKey = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_error) {
      // Ignore storage errors.
    }
    setLocalKey("");
  };

  const apiKey = envKey || localKey;
  const source = (envKey ? "env" : localKey ? "local" : "none") as "env" | "local" | "none";

  return {
    apiKey,
    source,
    saveKey,
    clearKey
  };
};
