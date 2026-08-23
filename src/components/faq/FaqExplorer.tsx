"use client";

import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { faqCategories, faqs } from "@/lib/data/faq";
import { cx } from "@/lib/format";

/** Searchable, category-filtered FAQ. Filtering is local — the set is small. */
export function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const inCategory = category === "all" || f.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const grouped = faqCategories
    .map((c) => ({ ...c, items: results.filter((f) => f.category === c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex flex-col gap-sm lg:flex-row lg:items-end lg:justify-between">
        <Field label="Search the FAQ" className="lg:max-w-[24rem] lg:flex-1">
          {({ inputId }) => (
            <TextInput
              id={inputId}
              type="search"
              placeholder="height, cancel, helmet…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
        </Field>

        <div>
          <p className="t-caption-upper mb-xxs text-muted-soft">Category</p>
          <div className="flex flex-wrap gap-xxs">
            {[{ id: "all", label: "All" }, ...faqCategories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={cx(
                  "t-nav-link h-10 border px-xs transition-colors duration-200",
                  category === c.id
                    ? "border-primary bg-primary text-on-primary"
                    : "border-hairline text-ink hover:border-ink/50"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="t-caption mt-sm text-muted-soft" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "question" : "questions"}
        {query ? ` matching “${query}”` : ""}
      </p>

      <div className="mt-md">
        {results.length === 0 ? (
          <EmptyState
            title="Nothing matches that search"
            message={`We don't have an answer containing “${query}”. Clear the search to browse everything, or message us on WhatsApp — a person will answer.`}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Clear search
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-lg">
            {grouped.map((group) => (
              <section key={group.id} aria-labelledby={`faq-${group.id}`}>
                <h2
                  id={`faq-${group.id}`}
                  className="t-caption-upper flex items-center gap-xxs text-muted-soft"
                >
                  <span className="h-px w-6 bg-primary" aria-hidden="true" />
                  {group.label}
                </h2>
                <Accordion className="mt-xs" items={group.items} />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
