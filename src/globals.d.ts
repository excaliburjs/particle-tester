export {};

declare global {
  interface Window {
    Prism: {
      highlightAll(): void;
    };
  }
}
