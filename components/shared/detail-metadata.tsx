import type { ReactNode } from "react";

type MetadataItem = {
  label: string;
  value: ReactNode;
};

export function DetailMetadata({ items }: { items: MetadataItem[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
