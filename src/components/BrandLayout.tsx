import React from "react";

type Props = {
  children: React.ReactNode;
};

const wrapper: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#fff",
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu",
  padding: 24,
  // бренд-градиент Teyra
  background: "linear-gradient(135deg,#004AAD 0%,#0099FF 100%)",
};

export default function BrandLayout({ children }: Props) {
  return <div style={wrapper}>{children}</div>;
}
