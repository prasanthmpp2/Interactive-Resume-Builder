# Interactive AI Resume Builder

Production-ready, frontend-only resume builder with live preview, AI enhancements, and PDF export.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS + PostCSS + Autoprefixer
- React Hook Form + Zod
- Zustand
- Headless UI
- Lucide React + Framer Motion
- React Beautiful DnD
- Hugging Face Inference API + Axios
- dom-to-image + jsPDF

## Setup

```bash
npm install
npm run dev
```

Create `.env` (see `.env.example`):

```env
VITE_HF_API_KEY=your_huggingface_api_key
VITE_HF_TOKEN=optional_alias_same_as_api_key
VITE_HF_MODEL=moonshotai/Kimi-K2.5
```

## Features

- Dynamic form sections with add/remove
- Live preview with 3 templates
- AI summary improvement, experience rewrite, bullet generation, grammar fixes
- ATS suggestions + strength score
- Drag & drop section reordering
- Auto-save and restore (Local Storage + IndexedDB)
- Light/Dark mode
- High-quality PDF export

## Project Structure

```text
src/
  components/
    ai/
    form/
    preview/
  data/
  hooks/
  lib/
  store/
  types/
  App.tsx
  main.tsx
  index.css
```
