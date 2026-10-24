/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of Clue's AI relay. Unset = the AI option is hidden. */
  readonly VITE_AI_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
