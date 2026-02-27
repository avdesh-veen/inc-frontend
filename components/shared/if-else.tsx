import type { ReactNode } from "react";

export function If({
  condition,
  children,
}: Readonly<{
  condition: boolean;
  children: ReactNode;
}>) {
  if (condition) {
    return children;
  }
  return null;
}

export function Else({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}

export function IfElse({
  condition,
  children,
  elseChildren,
}: Readonly<{
  condition: boolean;
  children: ReactNode;
  elseChildren: ReactNode;
}>) {
  if (condition) {
    return children;
  }
  return <Else>{elseChildren}</Else>;
}
