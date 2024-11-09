/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_MH_QUERY: string;
    readonly VITE_AMBIENTE_MH: "00"| "01";
    readonly VITE_WS_URL: string;
    readonly VITE_API_FIRMADOR: string;
    readonly VITE_MH_DTE: string;
    readonly VITE_MH_URL: string;
    readonly VITE_AUTH_MH: string;
    readonly VITE_CHECK_URL: string;
    readonly VITE_SPACES_BUCKET: string;
    readonly VITE_CRP: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }