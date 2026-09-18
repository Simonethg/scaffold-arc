import Image from "next/image";

type ArcLogoProps = {
  className?: string;
  /** Visual size; minimum 50px per Circle brand guidelines for digital use. */
  height?: number;
};

export function ArcLogo({ className = "arc-logo-inline", height = 22 }: ArcLogoProps) {
  const width = Math.round((height / 49) * 234);
  return (
    <Image
      src="/brand/arc-logo.svg"
      alt="Arc"
      width={width}
      height={height}
      className={className}
      data-testid="arc-logo"
    />
  );
}
