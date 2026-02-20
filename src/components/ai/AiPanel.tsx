import { Sparkles } from "lucide-react";
import { useResumeStore } from "../../store/resumeStore";

const AiPanel = () => {
  const ai = useResumeStore((state) => state.ai);
  const score = ai.strengthScore ?? 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            AI Analysis
          </p>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">ATS Score</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on resume content completeness.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/40 px-2 py-1 text-[11px] text-teal-600 dark:text-teal-300">
          <Sparkles className="h-3.5 w-3.5" />
          {score}%
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Score</span>
          <span>{score}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Tip: increase role-specific keywords and quantified outcomes to improve score.
      </p>
    </div>
  );
};

export default AiPanel;
