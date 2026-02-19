import { ResumeData } from "../types/resume";

export const sampleResume: ResumeData = {
  personal: {
    name: "Aarav Mehta",
    email: "aarav.mehta@email.com",
    phone: "+1 555 210 9987",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/aaravmehta",
    github: "github.com/aaravmehta",
    summary:
      "Product-focused Frontend Engineer with 6+ years building SaaS platforms. Shipped 15+ releases that lifted activation by 22% and reduced support tickets by 30%. Skilled in React, TypeScript, and performance optimization, aiming to scale reliable user experiences."
  },
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "University of Illinois Urbana-Champaign",
      year: "2015 - 2019",
      score: "GPA 3.7/4.0"
    }
  ],
  experience: [
    {
      company: "Northwind Labs",
      role: "Senior Frontend Engineer",
      duration: "2021 - Present",
      description:
        "Led redesign of customer onboarding, increasing completion rate from 62% to 81%. Built a shared component library used across 5 teams and cut UI regressions by 40%."
    },
    {
      company: "Everpeak",
      role: "Frontend Engineer",
      duration: "2019 - 2021",
      description:
        "Delivered analytics dashboard with real-time charts for 8K+ daily users. Optimized bundle size by 28% and improved Core Web Vitals across flagship pages."
    }
  ],
  projects: [
    {
      name: "InsightOps",
      link: "https://insightops.app",
      description:
        "Built an AI-assisted reporting tool that generates executive summaries from operational data. Reduced weekly reporting time by 6 hours per team.",
      tech: "React, TypeScript, Node.js, PostgreSQL"
    }
  ],
  skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "React Hook Form",
    "Node.js",
    "REST APIs",
    "Performance Optimization"
  ],
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2023"
    }
  ]
};
