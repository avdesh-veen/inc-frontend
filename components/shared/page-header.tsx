import type { ReactNode } from "react";
import { BackButton } from "./back-button";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
  backButton?: ReactNode;
  backButtonHref?: string;
};

export function PageHeader(props: Readonly<Props>) {
  const { title, description, children, backButton, backButtonHref } = props;

  const backButtonLink = backButtonHref ? (
    <BackButton href={backButtonHref} />
  ) : null;

  const backButtonComponent = backButton ?? backButtonLink;

  return (
    <div className="flex items-center gap-4">
      {backButtonComponent ?? null}

      <div className="flex-1">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="text-sm text-white/50">{description}</div>
      </div>

      {children}
    </div>
  );
}
