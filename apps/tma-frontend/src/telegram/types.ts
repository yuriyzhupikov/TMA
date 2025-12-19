export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        HapticFeedback?: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "soft" | "rigid") => void;
        };
        openTelegramLink?: (url: string) => void;
      };
    };
  }
}
