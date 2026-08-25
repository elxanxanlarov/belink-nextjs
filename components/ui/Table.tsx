import React from "react";

export interface ColumnDefinition {
  header: string;
  className?: string;
}

export interface TableProps {
  columns: ColumnDefinition[];
  children?: React.ReactNode;
  isEmpty?: boolean;
  emptyState?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  columns,
  children,
  isEmpty = false,
  emptyState,
}) => {
  if (isEmpty && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {columns.map((col, index) => (
              <th key={index} className={`px-6 py-3.5 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
};
