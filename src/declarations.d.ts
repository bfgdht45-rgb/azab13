declare module 'react-katex';
declare module 'mathlive';
declare module 'react-dropzone';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly [key: string]: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
