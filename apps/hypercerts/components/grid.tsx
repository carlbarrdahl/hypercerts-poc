import { ReactNode } from "react";
import { EmptyState, EmptyStateProps } from "./empty-state";
import { ErrorMessageLog } from "./error-message";
import { cn } from "@workspace/ui/lib/utils";

type ColumnValue = 0 | 1 | 2 | 3 | 4;
export type Columns = [ColumnValue?, ColumnValue?, ColumnValue?, ColumnValue?];

export type GridProps<T> = {
  columns?: Columns;
  loadingItems?: number;
  renderItem: (item: T, index: number, keyProps: string[]) => ReactNode;
  emptyState?: EmptyStateProps;
  keyProps?: string[]
};

type Props<T> = {
  data?: T[];
  error: unknown | null;
  isPending: boolean;
} & GridProps<T>;

export function Grid<T extends unknown>({
  columns = [1, 1, 2, 3],
  loadingItems = 6,
  data,
  error,
  isPending,
  renderItem,
  emptyState,
  keyProps = ["id"],
}: Props<T>) {
  if (error) return <ErrorMessageLog error={error} />;
  if (!isPending && !data?.length) return <EmptyState {...emptyState} />;

  return (
    <div className={cn("grid gap-4", gridClass(columns))}>
      {(isPending ? createLoadingCards<T>(loadingItems, keyProps) : data)?.map(
        (item, i) => renderItem(item, i, keyProps)
      )}
    </div>
  );
}

function createLoadingCards<T>(length: number, keyProps: string[]) {
  return Array.from({ length })
    .fill(0)
    .map(
      (_, id) =>
        ({
          ...keyProps.reduce((acc, key) => ({ ...acc, [key]: String(id) }), {}),
          isLoading: true,
        }) as T
    );
}
function gridClass(columns: Columns): string {
  return columns.reduce<string>(
    (cols, col = 0, i) => cols.concat(columnMap?.[i]?.[col] ?? "") + " ",
    ""
  );
}
const columnMap = [
  {
    0: "",
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  },
  {
    0: "",
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  },
  {
    0: "",
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  },
  {
    0: "",
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
  },
] as const;