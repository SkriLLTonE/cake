export function VintageFlourish({
  className = "",
  tone = "cherry",
}: {
  className?: string;
  tone?: "cherry" | "chocolate";
}) {
  const stroke = tone === "cherry" ? "#8b1e3f" : "#4a2c1a";
  return (
    <svg
      className={className}
      viewBox="0 0 240 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 20h64M168 20h64"
        stroke={stroke}
        strokeWidth="1.2"
        opacity="0.55"
      />
      <path
        d="M96 20c8-14 20-14 28 0 8 14 20 14 28 0"
        stroke={stroke}
        strokeWidth="1.4"
        opacity="0.7"
      />
      <circle cx="120" cy="20" r="3.2" fill={stroke} opacity="0.75" />
      <path
        d="M72 20c6-8 12-8 18 0M150 20c6 8 12 8 18 0"
        stroke={stroke}
        strokeWidth="1.2"
        opacity="0.55"
      />
    </svg>
  );
}

export function VintageCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 56V20c0-6.6 5.4-12 12-12h36"
        stroke="#8b1e3f"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M20 28c8-10 18-12 28-8"
        stroke="#4a2c1a"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <circle cx="22" cy="22" r="2.5" fill="#8b1e3f" opacity="0.7" />
    </svg>
  );
}
