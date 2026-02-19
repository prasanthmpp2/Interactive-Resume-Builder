import { Suspense, useEffect, useMemo, lazy } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FileDown, Moon, SunMedium } from "lucide-react";
import { resumeSchema } from "./lib/schema";
import { computeCompletion, computeHeuristicScore, defaultResume } from "./lib/resume";
import { exportResumePdf } from "./lib/pdf";
import { useAiActions } from "./hooks/useAi";
import { useResumePersistence } from "./hooks/useResumePersistence";
import { useTheme } from "./hooks/useTheme";
import { useResumeStore } from "./store/resumeStore";
import { ResumeData, TemplateId } from "./types/resume";
import { CertificationsSection } from "./components/form/CertificationsSection";
import { EducationSection } from "./components/form/EducationSection";
import { ExperienceSection } from "./components/form/ExperienceSection";
import { PersonalSection } from "./components/form/PersonalSection";
import { ProjectsSection } from "./components/form/ProjectsSection";
import { SkillsSection } from "./components/form/SkillsSection";
import { SectionOrder } from "./components/SectionOrder";

const ResumePreview = lazy(() => import("./components/preview/ResumePreview"));
const AiPanel = lazy(() => import("./components/ai/AiPanel"));

const templates: { id: TemplateId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "slate", label: "Slate" },
  { id: "emerald", label: "Emerald" },
  { id: "indigo", label: "Indigo" },
  { id: "amber", label: "Amber" },
  { id: "rose", label: "Rose" },
  { id: "graphite", label: "Graphite" },
  { id: "serif", label: "Serif" },
  { id: "executive", label: "Executive" },
  { id: "aurora", label: "Aurora" },
  { id: "cobalt", label: "Cobalt" },
  { id: "mono", label: "Mono" },
  { id: "clean", label: "Clean" },
  { id: "bold", label: "Bold" },
  { id: "airy", label: "Airy" },
  { id: "contrast", label: "Contrast" },
  { id: "skyline", label: "Skyline" },
  { id: "horizon", label: "Horizon" },
  { id: "ink", label: "Ink" },
  { id: "sand", label: "Sand" },
  { id: "ocean", label: "Ocean" },
  { id: "forest", label: "Forest" }
];

const cleanFilename = (name: string) =>
  (name || "resume").replace(/[^\w\-]+/g, "_").slice(0, 40) || "resume";

const App = () => {
  const { isDark, toggle } = useTheme();
  const {
    resume,
    template,
    sectionOrder,
    ai,
    setResume,
    setTemplate,
    setSectionOrder,
    setAi
  } = useResumeStore();

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume || defaultResume,
    mode: "onChange"
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setResume(value as ResumeData);
    });
    return () => subscription.unsubscribe();
  }, [form, setResume]);

  useResumePersistence(resume, setResume, form.reset);

  const completion = useMemo(() => computeCompletion(resume), [resume]);

  useEffect(() => {
    if (ai.scoreSource !== "ai") {
      const score = computeHeuristicScore(resume);
      setAi({ strengthScore: score, scoreSource: "heuristic" });
    }
  }, [ai.scoreSource, resume, setAi]);

  const { improveSummary, rewriteExperience, generateBullets, grammarImprove } = useAiActions();

  const handleImproveSummary = async () => {
    const summary = form.getValues("personal.summary");
    if (!summary) return;
    const output = await improveSummary(summary);
    if (output) {
      const cleaned = output.replace(/\s+/g, " ").trim();
      const limited =
        cleaned.length > 280 ? cleaned.slice(0, 279).replace(/\s+\S*$/, "") : cleaned;
      form.setValue("personal.summary", limited, { shouldDirty: true });
    }
  };

  const handleRewriteExperience = async (index: number) => {
    const entry = form.getValues(`experience.${index}`);
    const output = await rewriteExperience(entry.role, entry.company, entry.description);
    if (output) {
      form.setValue(`experience.${index}.description`, output, { shouldDirty: true });
    }
  };

  const handleGenerateBullets = async (index: number) => {
    const entry = form.getValues(`experience.${index}`);
    const output = await generateBullets(entry.role, entry.company);
    if (!output) return;
    const bullets = output
      .split("\n")
      .map((line) => line.replace(/^[\-\d\.\)]\s*/, "").trim())
      .filter(Boolean)
      .map((line) => `- ${line}`)
      .join("\n");
    const current = form.getValues(`experience.${index}.description`);
    const next = current ? `${current}\n${bullets}` : bullets;
    form.setValue(`experience.${index}.description`, next, { shouldDirty: true });
  };

  const handleGrammarImprove = async (index: number) => {
    const entry = form.getValues(`experience.${index}.description`);
    if (!entry) return;
    const output = await grammarImprove(entry);
    if (output) {
      form.setValue(`experience.${index}.description`, output, { shouldDirty: true });
    }
  };


  const addEducation = () => {
    const next = [...form.getValues("education"), { degree: "", institution: "", year: "", score: "" }];
    form.setValue("education", next, { shouldDirty: true });
  };

  const removeEducation = (index: number) => {
    const next = form.getValues("education").filter((_, idx) => idx !== index);
    form.setValue("education", next.length ? next : [{ degree: "", institution: "", year: "", score: "" }], {
      shouldDirty: true
    });
  };

  const addExperience = () => {
    const next = [
      ...form.getValues("experience"),
      { company: "", role: "", duration: "", description: "" }
    ];
    form.setValue("experience", next, { shouldDirty: true });
  };

  const removeExperience = (index: number) => {
    const next = form.getValues("experience").filter((_, idx) => idx !== index);
    form.setValue(
      "experience",
      next.length ? next : [{ company: "", role: "", duration: "", description: "" }],
      { shouldDirty: true }
    );
  };

  const addProject = () => {
    const next = [
      ...form.getValues("projects"),
      { name: "", link: "", description: "", tech: "" }
    ];
    form.setValue("projects", next, { shouldDirty: true });
  };

  const removeProject = (index: number) => {
    const next = form.getValues("projects").filter((_, idx) => idx !== index);
    form.setValue("projects", next.length ? next : [{ name: "", link: "", description: "", tech: "" }], {
      shouldDirty: true
    });
  };

  const addCertification = () => {
    const next = [
      ...form.getValues("certifications"),
      { name: "", issuer: "", year: "" }
    ];
    form.setValue("certifications", next, { shouldDirty: true });
  };

  const removeCertification = (index: number) => {
    const next = form.getValues("certifications").filter((_, idx) => idx !== index);
    form.setValue("certifications", next.length ? next : [{ name: "", issuer: "", year: "" }], {
      shouldDirty: true
    });
  };

  const handleExport = async () => {
    const element = document.getElementById("resume-preview-surface");
    if (!element) return;
    try {
      await exportResumePdf(element, `${cleanFilename(resume.personal.name)}.pdf`);
    } catch (_error) {
      alert("PDF export failed. Please try again.");
    }
  };


  return (
    <div className="min-h-screen px-4 pb-12 pt-8">
      <header className="glass-card mb-8 flex flex-col gap-6 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-teal-600">Interactive Resume Builder</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            Build, enhance, and export in one workspace.
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Live preview, AI refinement, and drag-and-drop ordering.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[140px] rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Completion</span>
              <span className="font-semibold text-slate-900 dark:text-white">{completion.percent}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500"
                style={{ width: `${completion.percent}%` }}
              />
            </div>
          </div>
          <select
            value={template}
            onChange={(event) => setTemplate(event.target.value as TemplateId)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {templates.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} Template
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Light" : "Dark"}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-500"
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <PersonalSection form={form} onImproveSummary={handleImproveSummary} loading={ai.loading} />
          <EducationSection form={form} onAdd={addEducation} onRemove={removeEducation} />
          <ExperienceSection
            form={form}
            onAdd={addExperience}
            onRemove={removeExperience}
            onRewrite={handleRewriteExperience}
            onBullets={handleGenerateBullets}
            onGrammar={handleGrammarImprove}
            loading={ai.loading}
          />
          <ProjectsSection form={form} onAdd={addProject} onRemove={removeProject} />
          <SkillsSection form={form} />
          <CertificationsSection form={form} onAdd={addCertification} onRemove={removeCertification} />
        </form>

        <div className="space-y-6">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Live Preview</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Updates instantly as you type.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {templates.find((item) => item.id === template)?.label} Style
              </span>
            </div>
            <div className="mt-4">
              <Suspense fallback={<div className="text-sm text-slate-400">Loading preview...</div>}>
                <AnimatePresence mode="wait">
                  <motion.div key={template} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ResumePreview resume={resume} template={template} order={sectionOrder} />
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </div>
          </div>

          <SectionOrder order={sectionOrder} onReorder={setSectionOrder} />

          <Suspense fallback={<div className="text-sm text-slate-400">Loading ATS score...</div>}>
            <AiPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
