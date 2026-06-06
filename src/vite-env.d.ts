/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_CLAUDE_API_KEY: string
  readonly VITE_TELEGRAM_BOT_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}