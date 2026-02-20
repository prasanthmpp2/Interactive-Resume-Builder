import { useMemo, useState } from "react";
import { KeyRound, Save, Trash2 } from "lucide-react";
import { useApiKey } from "../../hooks/useApiKey";
import { DEFAULT_MODEL } from "../../lib/ai";

const MODEL_STORAGE_KEY = "irb-hf-model";

const readModel = () => {
  try {
    return localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL;
  } catch (_error) {
    return DEFAULT_MODEL;
  }
};

const maskKey = (value: string) => {
  if (!value) return "";
  if (value.length <= 12) return "************";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const ApiKeyPanel = () => {
  const { apiKey, source, saveKey, clearKey } = useApiKey();
  const [keyInput, setKeyInput] = useState("");
  const [modelInput, setModelInput] = useState(() => readModel());
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sourceText = useMemo(() => {
    if (source === "env") return "Using build-time key";
    if (source === "local") return "Using browser key";
    return "No key configured";
  }, [source]);

  const handleSaveKey = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setError("Enter a Hugging Face token.");
      setNotice("");
      return;
    }
    if (!trimmed.startsWith("hf_")) {
      setError("Token should start with hf_.");
      setNotice("");
      return;
    }
    saveKey(trimmed);
    setKeyInput("");
    setError("");
    setNotice("Token saved to this browser.");
  };

  const handleClearKey = () => {
    clearKey();
    setError("");
    setNotice("Saved browser token removed.");
  };

  const handleSaveModel = () => {
    const value = modelInput.trim() || DEFAULT_MODEL;
    try {
      localStorage.setItem(MODEL_STORAGE_KEY, value);
      setModelInput(value);
      setError("");
      setNotice("Model saved to this browser.");
    } catch (_error) {
      setError("Could not save model in browser storage.");
      setNotice("");
    }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            AI Settings
          </p>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Hugging Face</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-600 dark:text-slate-300">
          <KeyRound className="h-3.5 w-3.5" />
          {sourceText}
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Current key: {apiKey ? maskKey(apiKey) : "Not set"}
      </p>

      <label className="mt-3 block text-xs font-medium text-slate-600 dark:text-slate-300">
        API Key
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          type="password"
          value={keyInput}
          onChange={(event) => setKeyInput(event.target.value)}
          placeholder="hf_xxxxxxxxxxxxxxxxx"
          className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={handleSaveKey}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-teal-500 px-4 text-sm font-medium text-teal-600 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-500/10"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
        <button
          type="button"
          onClick={handleClearKey}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      <label className="mt-4 block text-xs font-medium text-slate-600 dark:text-slate-300">
        Model
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={modelInput}
          onChange={(event) => setModelInput(event.target.value)}
          placeholder={DEFAULT_MODEL}
          className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={handleSaveModel}
          className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Save Model
        </button>
      </div>

      {error ? <p className="mt-3 text-xs text-rose-600 dark:text-rose-400">{error}</p> : null}
      {notice ? <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">{notice}</p> : null}
    </div>
  );
};

export default ApiKeyPanel;
