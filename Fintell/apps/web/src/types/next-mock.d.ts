// Mock Next.js modules
declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
  };
  
  export function useSearchParams(): URLSearchParams;
  export function usePathname(): string;
}

declare module 'next/link' {
  import { ReactNode } from 'react';
  
  interface LinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    prefetch?: boolean;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
  }
  
  export default function Link(props: LinkProps): JSX.Element;
}