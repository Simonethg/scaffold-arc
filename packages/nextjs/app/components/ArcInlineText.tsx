"use client";

import { Fragment, type ReactNode } from "react";
import { ArcLogo } from "./ArcLogo";

const ARC_LOGO_TOKEN = "{arcLogo}";

/** Renders copy with `{arcLogo}` as the official Arc wordmark. Used only for `heroTitle`. */
export function ArcInlineText({ text }: { text: string }) {
  if (!text.includes(ARC_LOGO_TOKEN)) {
    return <>{text}</>;
  }
  const parts = text.split(ARC_LOGO_TOKEN);
  const nodes: ReactNode[] = [];
  parts.forEach((part, index) => {
    if (part) nodes.push(<Fragment key={`t-${index}`}>{part}</Fragment>);
    if (index < parts.length - 1) {
      nodes.push(<ArcLogo key={`logo-${index}`} />);
    }
  });
  return <>{nodes}</>;
}
