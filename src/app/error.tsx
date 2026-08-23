"use client";

import { useEffect } from "react";
import { Button, ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { site, whatsappLink } from "@/lib/data/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire this to your error reporter — the digest is what correlates a user
    // report with the server-side stack trace.
    console.error("Unhandled application error", error);
  }, [error]);

  return (
    <div className="editorial flex min-h-[60svh] flex-col justify-center py-xl">
      <div className="max-w-[36rem]">
        <p className="t-caption-upper flex items-center gap-xxs text-warning">
          <span className="h-px w-8 bg-warning" aria-hidden="true" />
          Red flag
        </p>

        <h1 className="t-display-lg mt-sm text-ink">
          Something on our side stopped working.
        </h1>

        <p className="t-body-md mt-sm text-body">
          This is our fault, not yours. Nothing you were doing has been charged or
          confirmed. Try again — and if it happens twice, message us on WhatsApp
          and we&apos;ll handle it directly.
        </p>

        {error.digest && (
          <p className="t-caption mt-sm text-muted-soft">
            Reference for our team:{" "}
            <span className="tabular text-body-strong">{error.digest}</span>
          </p>
        )}

        <div className="mt-lg flex flex-wrap gap-xxs">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="outline">
            Back to the home page
          </ButtonLink>
          <ButtonAnchor
            href={whatsappLink(
              site.whatsapp,
              `Hi ${site.name} — the website hit an error${error.digest ? ` (ref ${error.digest})` : ""} and I'd like to book directly.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp us
          </ButtonAnchor>
        </div>
      </div>
    </div>
  );
}
