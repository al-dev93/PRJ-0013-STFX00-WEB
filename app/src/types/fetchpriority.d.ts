export {};

declare module 'react' {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: ('auto' | 'high' | 'low') & (T extends unknown ? unknown : never);
  }
}
