import { useEffect, useRef } from "react";
import { defaultResume } from "../lib/resume";
import { ResumeData } from "../types/resume";
import { useIndexedDb } from "./useIndexedDb";

const STORAGE_KEY = "irb-resume-data-v2";

export const useResumePersistence = (
  resume: ResumeData,
  setResume: (data: ResumeData) => void,
  resetForm: (data: ResumeData) => void
) => {
  const { getItem, setItem } = useIndexedDb();
  const hydratedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const normalize = (data: ResumeData) => ({
    ...defaultResume,
    ...data,
    personal: { ...defaultResume.personal, ...(data.personal || {}) },
    education: data.education?.length ? data.education : defaultResume.education,
    experience: data.experience?.length ? data.experience : defaultResume.experience,
    projects: data.projects?.length ? data.projects : defaultResume.projects,
    skills: data.skills ?? defaultResume.skills,
    certifications: data.certifications?.length ? data.certifications : defaultResume.certifications
  });

  useEffect(() => {
    const hydrate = async () => {
      if (hydratedRef.current) return;
      hydratedRef.current = true;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = normalize(JSON.parse(raw) as ResumeData);
          setResume(parsed);
          resetForm(parsed);
          return;
        }
      } catch (_error) {
        // Ignore storage errors.
      }

      const idbData = await getItem<ResumeData>(STORAGE_KEY);
      if (idbData) {
        const normalized = normalize(idbData);
        setResume(normalized);
        resetForm(normalized);
      }
    };

    void hydrate();
  }, [getItem, resetForm, setResume]);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      } catch (_error) {
        // Ignore storage errors.
      }
      void setItem(STORAGE_KEY, resume);
    }, 250);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [resume, setItem]);
};
