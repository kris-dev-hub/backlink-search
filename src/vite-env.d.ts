/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_API_BASE_URL: string
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
