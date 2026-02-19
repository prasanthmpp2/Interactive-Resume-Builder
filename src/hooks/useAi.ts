import { useCallback } from "react";
import { callHuggingFace } from "../lib/ai";
import { computeHeuristicScore } from "../lib/resume";
import { ResumeData } from "../types/resume";
import { useResumeStore } from "../store/resumeStore";

const listify = (text: string) =>
  text
    .split("\n")
    .map((line) => line.replace(/^[\-\d\.\)]\s*/, "").trim())
    .filter(Boolean);

const extractScore = (text: string) => {
  const match = text.match(/(\d{1,3})/);
  if (!match) return null;
  const value = Number(match[1]);
  if (Number.isNaN(value)) return null;
  return Math.min(100, Math.max(0, value));
};

export const useAiActions = () => {
  const { setAi, setAiLoading } = useResumeStore((state) => ({
    setAi: state.setAi,
    setAiLoading: state.setAiLoading
  }));

  const runAction = useCallback(
    async (action: string, prompt: string) => {
      setAiLoading(true, action);
      setAi({ error: undefined });
      try {
        const output = await callHuggingFace(prompt);
        setAi({ lastOutput: output });
        return output;
      } catch (error) {
        const message = error instanceof Error ? error.message : "AI request failed.";
        setAi({ error: message });
        return null;
      } finally {
        setAiLoading(false);
      }
    },
    [setAi, setAiLoading]
  );

  const improveSummary = useCallback(
    async (summary: string) => {
      const prompt = `Improve this resume summary to be concise and impact-focused.
Return 2-3 sentences, max 70 words, no bullet points.\n${summary}`;
      return runAction("Improve Summary", prompt);
    },
    [runAction]
  );

  const rewriteExperience = useCallback(
    async (role: string, company: string, description: string) => {
      const prompt = `Rewrite this job description in a professional, achievement-oriented style.\nRole: ${role}\nCompany: ${company}\nDescription: ${description}`;
      return runAction("Rewrite Experience", prompt);
    },
    [runAction]
  );

  const generateBullets = useCallback(
    async (role: string, company: string) => {
      const prompt = `Generate 4 concise resume bullet points for this role with measurable impact.\nRole: ${role}\nCompany: ${company}`;
      return runAction("Generate Bullets", prompt);
    },
    [runAction]
  );

  const atsSuggestions = useCallback(
    async (resume: ResumeData) => {
      const prompt = `Provide ATS optimization suggestions as bullet points for this resume:\n${JSON.stringify(
        resume
      )}`;
      const output = await runAction("ATS Suggestions", prompt);
      return output ? listify(output) : null;
    },
    [runAction]
  );

  const grammarImprove = useCallback(
    async (content: string) => {
      const prompt = `Improve grammar and clarity without changing meaning:\n${content}`;
      return runAction("Grammar Improve", prompt);
    },
    [runAction]
  );

  const analyzeStrength = useCallback(
    async (resume: ResumeData) => {
      const prompt = `Rate this resume from 0 to 100 for strength and ATS readiness. Reply with only a number.\n${JSON.stringify(
        resume
      )}`;
      const output = await runAction("Strength Score", prompt);
      const aiScore = output ? extractScore(output) : null;
      const heuristic = computeHeuristicScore(resume);
      if (aiScore !== null) {
        return { score: aiScore, source: "ai" as const };
      }
      return { score: heuristic, source: "heuristic" as const };
    },
    [runAction]
  );

  return {
    improveSummary,
    rewriteExperience,
    generateBullets,
    atsSuggestions,
    grammarImprove,
    analyzeStrength
  };
};
