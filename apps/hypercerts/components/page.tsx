import { PropsWithChildren, ReactNode } from "react";
import { BackButton } from "@/components/back-button";

export function Page({
  actions,
  backLink,
  title,
  description,
  children,
}: PropsWithChildren<{
  actions?: ReactNode;
  backLink?: string;
  title: string | ReactNode;
  description?: string | ReactNode;
}>) {
  return (
    <>
      <header className="mb-6 flex justify-between items-start gap-6 w-full">
        <div>
          <div className="flex items-center gap-1">
            {backLink && <BackButton href={backLink} />}
            <h1 className="text-2xl font-medium text-card-foreground">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-muted-foreground py-2">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </header>
      {children}
    </>
  );
}
