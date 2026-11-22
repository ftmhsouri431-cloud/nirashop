export function formatToman(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export function newId(prefix = "p"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function splitList(value: string): string[] {
  return value
    .split(/[,،\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
