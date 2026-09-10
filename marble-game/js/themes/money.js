function numericAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) throw new TypeError("Theme money amount must be finite.");
  return amount;
}

export function formatThemeMoney(value, currency, { signed = false, compact = false } = {}) {
  const amount = numericAmount(value);
  const absolute = Math.abs(amount).toLocaleString("ko-KR");
  const sign = signed ? (amount > 0 ? "+" : amount < 0 ? "-" : "") : "";
  const label = compact ? currency?.symbol : currency?.label;
  const unit = label || currency?.symbol || currency?.code || "";

  if (!unit) return `${sign}${absolute}`;
  if (compact) return `${sign}${absolute}${unit}`;
  return `${sign}${absolute} ${unit}`;
}
