const toPx = (value: number): string => {
  return `${value}px`;
};

// Essa função foi criada para resolver o uso do line-height em casos web-only
export const toWebToken = (token: number): string => {
  return toPx(token);
};
