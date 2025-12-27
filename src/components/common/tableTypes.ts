export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  rowKey?: keyof T;
  onUpdateProject?: (updatedRow: T) => Promise<void> | void;
  onDeleteRow?: (row: T) => void;
  onViewRow?: (row: T) => void;
  onAddDescription?: (row: T) => void;
  onEditTitle?: (row: T) => void;
}

export interface TableAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}
