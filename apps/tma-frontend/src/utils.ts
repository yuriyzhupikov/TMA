export const uid = () => Math.random().toString(36).slice(2, 10);

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const formatDateTime = (value: number) =>
  new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
