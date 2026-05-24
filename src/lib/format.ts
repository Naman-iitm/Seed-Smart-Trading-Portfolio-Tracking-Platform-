export const currency = (n: number, fractionDigits = 2) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export const number = (n: number, fractionDigits = 2) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export const pct = (n: number, fractionDigits = 2) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(fractionDigits)}%`;

export const signed = (n: number, fractionDigits = 2) =>
  `${n >= 0 ? "+" : "-"}${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
