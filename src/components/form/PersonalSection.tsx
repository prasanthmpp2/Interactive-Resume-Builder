import { UseFormReturn } from "react-hook-form";
import { Wand2 } from "lucide-react";
import { ResumeData } from "../../types/resume";
import { Field } from "./Field";
import { SectionCard } from "./SectionCard";

type PersonalSectionProps = {
  form: UseFormReturn<ResumeData>;
  onImproveSummary: () => void;
  loading: boolean;
};

export const PersonalSection = ({ form, onImproveSummary, loading }: PersonalSectionProps) => {
  const {
    register,
    formState: { errors }
  } = form;
  const summaryValue = form.watch("personal.summary") ?? "";

  return (
    <SectionCard title="Personal Details" description="Introduce yourself and your professional brand.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full Name" required error={errors.personal?.name?.message}>
          <input
            {...register("personal.name")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Email" required error={errors.personal?.email?.message}>
          <input
            {...register("personal.email")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Phone" required error={errors.personal?.phone?.message}>
          <input
            {...register("personal.phone")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="+1 555 555 5555"
          />
        </Field>
        <Field label="Address" error={errors.personal?.address?.message}>
          <input
            {...register("personal.address")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="City, State"
          />
        </Field>
        <Field label="LinkedIn" error={errors.personal?.linkedin?.message}>
          <input
            {...register("personal.linkedin")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="linkedin.com/in/username"
          />
        </Field>
        <Field label="GitHub" error={errors.personal?.github?.message}>
          <input
            {...register("personal.github")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="github.com/username"
          />
        </Field>
      </div>
      <Field
        label={`Professional Summary (${summaryValue.length}/280)`}
        error={errors.personal?.summary?.message}
      >
        <textarea
          {...register("personal.summary")}
          maxLength={280}
          rows={5}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
          placeholder="Impact-driven product designer with 6+ years of experience..."
        />
      </Field>
      <button
        type="button"
        onClick={onImproveSummary}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-teal-500 px-4 py-2 text-sm font-medium text-teal-600 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-teal-300 dark:hover:bg-teal-500/10"
      >
        <Wand2 className="h-4 w-4" />
        Improve with AI
      </button>
    </SectionCard>
  );
};
