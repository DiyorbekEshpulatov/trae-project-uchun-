// @ts-nocheck
// Mock NextJS modules and types

declare module 'next' {
  export type NextPage<P = {}> = (props: P) => JSX.Element;
  export type GetServerSideProps<P = {}> = (context: any) => Promise<{ props: P }>;
  export type GetStaticProps<P = {}> = (context: any) => Promise<{ props: P }>;
  export type GetStaticPaths = () => Promise<{ paths: any[]; fallback: boolean }>;
}

declare module 'next/router' {
  export function useRouter(): {
    pathname: string;
    query: { [key: string]: string | string[] };
    push: (url: string) => Promise<void>;
    replace: (url: string) => Promise<void>;
    back: () => void;
    reload: () => void;
  };
  export function useSearchParams(): URLSearchParams;
  export function usePathname(): string;
}

declare module 'next/link' {
  export default function Link({ href, children, ...props }: any): JSX.Element;
}

declare module 'next/image' {
  export default function Image({ src, alt, width, height, ...props }: any): JSX.Element;
}

declare module 'next/head' {
  export default function Head({ children }: any): JSX.Element;
}

declare module 'next/document' {
  export class Html extends React.Component<any> {}
  export class Head extends React.Component<any> {}
  export class Main extends React.Component<any> {}
  export class NextScript extends React.Component<any> {}
}