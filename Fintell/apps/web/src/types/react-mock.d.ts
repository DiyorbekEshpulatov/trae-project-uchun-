// Mock React for TypeScript
declare module 'react' {
  export = React;
}

declare namespace React {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<T, A>(reducer: (state: T, action: A) => T, initialState: T): [T, (action: A) => void];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(): React.MutableRefObject<T | undefined>;
  
  export interface Context<T> {
    Provider: React.ComponentType<{ value: T; children?: React.ReactNode }>;
    Consumer: React.ComponentType<{ children: (value: T) => React.ReactNode }>;
  }
  
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function createContext<T>(defaultValue: T | undefined): React.Context<T | undefined>;
  
  export interface MutableRefObject<T> {
    current: T;
  }
  
  export type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
  export type ReactChild = ReactElement | ReactText;
  export type ReactText = string | number;
  export type ReactFragment = {} | ReactNodeArray;
  export type ReactNodeArray = ReactNode[];
  export type ReactPortal = any;
  
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  export type Key = string | number;
  export type JSXElementConstructor<P> = (props: P) => ReactElement | null;
  
  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
  export type FunctionComponent<P = {}> = (props: P) => ReactElement | null;
  
  export interface ComponentClass<P = {}, S = {}> {
    new (props: P, context?: any): Component<P, S>;
  }
  
  export class Component<P, S> {
    constructor(props: P, context?: any);
    props: P;
    state: S;
    context: any;
    setState<K extends keyof S>(state: ((prevState: S, props: P) => Pick<S, K>) | Pick<S, K>, callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
  }
  
  export interface DOMAttributes<T> {
    onClick?: (event: any) => void;
    onChange?: (event: any) => void;
    onSubmit?: (event: any) => void;
    className?: string;
    id?: string;
    style?: CSSProperties;
  }
  
  export interface CSSProperties {
    [key: string]: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DOMAttributes<HTMLDivElement> & { className?: string; id?: string; style?: React.CSSProperties };
      h1: React.DOMAttributes<HTMLHeadingElement> & { className?: string; id?: string; style?: React.CSSProperties };
      h2: React.DOMAttributes<HTMLHeadingElement> & { className?: string; id?: string; style?: React.CSSProperties };
      h3: React.DOMAttributes<HTMLHeadingElement> & { className?: string; id?: string; style?: React.CSSProperties };
      p: React.DOMAttributes<HTMLParagraphElement> & { className?: string; id?: string; style?: React.CSSProperties };
      span: React.DOMAttributes<HTMLSpanElement> & { className?: string; id?: string; style?: React.CSSProperties };
      a: React.DOMAttributes<HTMLAnchorElement> & { href?: string; className?: string; id?: string; style?: React.CSSProperties };
      button: React.DOMAttributes<HTMLButtonElement> & { 
        onClick?: (event: any) => void; 
        className?: string; 
        id?: string; 
        style?: React.CSSProperties;
        type?: 'button' | 'submit' | 'reset';
      };
      input: React.DOMAttributes<HTMLInputElement> & { 
        type?: string;
        value?: string | number;
        onChange?: (event: any) => void;
        className?: string; 
        id?: string; 
        style?: React.CSSProperties;
        placeholder?: string;
        required?: boolean;
      };
      form: React.DOMAttributes<HTMLFormElement> & { 
        onSubmit?: (event: any) => void; 
        className?: string; 
        id?: string; 
        style?: React.CSSProperties;
      };
      label: React.DOMAttributes<HTMLLabelElement> & { 
        htmlFor?: string;
        className?: string; 
        id?: string; 
        style?: React.CSSProperties;
      };
      ul: React.DOMAttributes<HTMLUListElement> & { className?: string; id?: string; style?: React.CSSProperties };
      ol: React.DOMAttributes<HTMLOListElement> & { className?: string; id?: string; style?: React.CSSProperties };
      li: React.DOMAttributes<HTMLLIElement> & { className?: string; id?: string; style?: React.CSSProperties };
      nav: React.DOMAttributes<HTMLElement> & { className?: string; id?: string; style?: React.CSSProperties };
      header: React.DOMAttributes<HTMLElement> & { className?: string; id?: string; style?: React.CSSProperties };
      footer: React.DOMAttributes<HTMLElement> & { className?: string; id?: string; style?: React.CSSProperties };
      main: React.DOMAttributes<HTMLElement> & { className?: string; id?: string; style?: React.CSSProperties };
      section: React.DOMAttributes<HTMLElement> & { className?: string; id?: string; style?: React.CSSProperties };
      article: React.DOMAttributes<HTMLElement> & { className?: string; id?: string; style?: React.CSSProperties };
      aside: React.DOMAttributes<HTMLElement> & { className?: string; id?: string; style?: React.CSSProperties };
      table: React.DOMAttributes<HTMLTableElement> & { className?: string; id?: string; style?: React.CSSProperties };
      thead: React.DOMAttributes<HTMLTableSectionElement> & { className?: string; id?: string; style?: React.CSSProperties };
      tbody: React.DOMAttributes<HTMLTableSectionElement> & { className?: string; id?: string; style?: React.CSSProperties };
      tr: React.DOMAttributes<HTMLTableRowElement> & { className?: string; id?: string; style?: React.CSSProperties };
      td: React.DOMAttributes<HTMLTableDataCellElement> & { className?: string; id?: string; style?: React.CSSProperties };
      th: React.DOMAttributes<HTMLTableHeaderCellElement> & { className?: string; id?: string; style?: React.CSSProperties };
    }
  }
}