import axios from "axios";

export const DEFAULT_MODEL = "moonshotai/Kimi-K2.5";
const STORAGE_KEY = "irb-hf-key";
const MODEL_STORAGE_KEY = "irb-hf-model";

const extractText = (payload: unknown) => {
  if (Array.isArray(payload) && payload.length > 0) {
    const item = payload[0] as Record<string, unknown>;
    if (typeof item.generated_text === "string") return item.generated_text;
    if (typeof item.summary_text === "string") return item.summary_text;
  }
  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    if (Array.isArray(data.choices) && data.choices.length > 0) {
      const choice = data.choices[0] as { message?: { content?: string } };
      const content = choice?.message?.content;
      if (typeof content === "string") return content;
    }
  }
  if (typeof payload === "string") return payload;
  return JSON.stringify(payload);
};

const getRuntimeKey = () => {
  const envKey = import.meta.env.VITE_HF_API_KEY || import.meta.env.VITE_HF_TOKEN;
  if (envKey) return envKey;
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch (_error) {
    return "";
  }
};

export const callHuggingFace = async (prompt: string) => {
  const apiKey = getRuntimeKey();
  const model = (() => {
    try {
      return localStorage.getItem(MODEL_STORAGE_KEY) || import.meta.env.VITE_HF_MODEL || DEFAULT_MODEL;
    } catch (_error) {
      return import.meta.env.VITE_HF_MODEL || DEFAULT_MODEL;
    }
  })();

  if (!apiKey) {
    throw new Error("Missing VITE_HF_API_KEY (or VITE_HF_TOKEN) in .env");
  }

  const headers = { Authorization: `Bearer ${apiKey}` };

  const callRouter = async () => {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      },
      { headers }
    );
    return extractText(response.data).trim();
  };

  const callInference = async () => {
    const fallbackModel = model.split(":")[0];
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${fallbackModel}`,
      {
        inputs: prompt,
        options: { wait_for_model: true }
      },
      { headers }
    );
    return extractText(response.data).trim();
  };

  try {
    return await callRouter();
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 402) {
      try {
        return await callInference();
      } catch (_fallbackError) {
        throw new Error(
          "HF Router returned 402 (payment required). Add credits or use a router-enabled provider."
        );
      }
    }
    throw error instanceof Error ? error : new Error("AI request failed.");
  }
};
