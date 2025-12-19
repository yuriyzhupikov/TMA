export const triggerHaptic = () => {
  if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
    return;
  }
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
};
