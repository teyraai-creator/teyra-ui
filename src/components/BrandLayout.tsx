import React from "react";

type Props = {
  children: React.ReactNode;
  active?: string;
  leftExtra?: React.ReactNode;
  leftAside?: React.ReactNode;
  sidebarExtra?: React.ReactNode;
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

export default function BrandLayout({ children, active, leftExtra, leftAside, sidebarExtra }: Props) {
  return <div style={wrapper}>{children}</div>;
}
