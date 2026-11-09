// Ambient declarations for legacy React components in src/

declare namespace React {
  interface CSSProperties {
    [key: string]: any;
  }
  interface SyntheticEvent<T = any> {
    preventDefault(): void;
    stopPropagation(): void;
    target: any;
    currentTarget: any;
  }
  interface FormEvent<T = any> extends SyntheticEvent<T> {}
  interface ChangeEvent<T = any> extends SyntheticEvent<T> {}
  interface KeyboardEvent<T = any> extends SyntheticEvent<T> {
    key: string;
    keyCode: number;
  }
  interface ClipboardEvent<T = any> extends SyntheticEvent<T> {
    clipboardData: any;
  }
  interface MouseEvent<T = any> extends SyntheticEvent<T> {
    clientX: number;
    clientY: number;
  }
  interface HTMLAttributes<T> {
    className?: string;
    style?: CSSProperties;
    children?: any;
    onClick?: (...args: any[]) => any;
    id?: string;
    title?: string;
    role?: string;
    key?: any;
    [key: string]: any;
  }
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    loading?: 'lazy' | 'eager';
    [key: string]: any;
  }
  interface ReactElement<P = any, T extends string | any = any> {
    type: T;
    props: P;
    key: string | null;
  }
  type ReactNode = any;
  type FC<P = {}> = (props: P) => any;
  interface Context<T> {
    Provider: any;
    Consumer: any;
  }
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  function useRef<T>(initialValue?: T): { current: T };
  function createContext<T>(defaultValue: T): Context<T>;
  function useContext<T>(context: Context<T>): T;
  const StrictMode: any;
  const createElement: any;
  const Fragment: any;
  const Component: any;
}

declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element extends any {}
    interface ElementClass extends any {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react/jsx-dev-runtime' {
  export namespace JSX {
    interface Element extends any {}
    interface ElementClass extends any {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export const jsxDEV: any;
  export const Fragment: any;
}

declare module 'react-dom' {
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react-dom/client' {
  export function createRoot(container: any): {
    render(children: any): void;
    unmount(): void;
  };
}

declare module 'lucide-react' {
  export const Home: any;
  export const Building2: any;
  export const User: any;
  export const Briefcase: any;
  export const Bell: any;
  export const ArrowRight: any;
  export const X: any;
  export const CheckCircle2: any;
  export const Star: any;
  export const Check: any;
  export const ChevronRight: any;
  export const ChevronLeft: any;
  export const ChevronDown: any;
  export const Menu: any;
  export const Phone: any;
  export const Mail: any;
  export const MapPin: any;
  export const Shield: any;
  export const Award: any;
  export const DollarSign: any;
  export const Percent: any;
  export const Clock: any;
  export const FileText: any;
  export const AlertCircle: any;
  export const HelpCircle: any;
  export const ExternalLink: any;
  export const Copy: any;
  export const Trash2: any;
  export const Edit: any;
  export const LogOut: any;
  export const Settings: any;
  export const Eye: any;
  export const EyeOff: any;
  export const Search: any;
  export const Filter: any;
  export const Download: any;
  export const Upload: any;
  export const RefreshCw: any;
  const content: any;
  export default content;
}

declare module 'motion/react' {
  export const motion: any;
  export const AnimatePresence: any;
  export const useReducedMotion: any;
  const content: any;
  export default content;
}

declare module 'motion' {
  export const motion: any;
  export const AnimatePresence: any;
  const content: any;
  export default content;
}
