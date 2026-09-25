import Image from "next/image";

type LogoVariant = "horizontal" | "vertical";

export function LogoMark({
  compact = false,
  variant,
  className = "",
}: {
  compact?: boolean;
  variant?: LogoVariant;
  className?: string;
}) {
  const resolvedVariant = variant ?? (compact ? "vertical" : "horizontal");
  const isHorizontal = resolvedVariant === "horizontal";

  const src = isHorizontal ? "/images/logo/hk-softtech-logo-h.png" : "/images/logo/hk-softtech-logo-v.png";
  const width = isHorizontal ? 640 : 260;
  const height = isHorizontal ? 180 : 260;

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ background: "transparent", border: "none", boxShadow: "none" }}
    >
      <Image
        src={src}
        alt="HK SoftTech logo"
        width={width}
        height={height}
        priority
        style={{ display: "block",border: "0px solid #1c59ff",background: "transparent", borderRadius: "20px" }}
        className={isHorizontal ? "block h-auto w-full object-contain" : "block h-auto w-[72px] object-contain"}
      />
    </div>
  );
}
