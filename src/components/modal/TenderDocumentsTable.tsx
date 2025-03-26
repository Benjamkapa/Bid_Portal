import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import { PiSortAscendingThin, PiSortDescendingThin } from "react-icons/pi";
import { FaEdit} from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

type TenderDocument = {
  id: number;
  beneficiary: string;
  tender_number: string;
  date: string;
  guarantee_no: string;
  guarantor: string;
  applicant: string;
  tender_amount: string;
  expiry_date: string;
  document_url: string;
  created_at: string;
};

interface TenderDocumentsTableProps {
  data: TenderDocument[];
  onEditClick: (document: TenderDocument) => void;
}

const TenderDocumentsTable: React.FC<TenderDocumentsTableProps> = ({ data, onEditClick }) => {
  // const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<TenderDocument>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
    },
    {
      accessorKey: "beneficiary",
      header: "Beneficiary",
      enableSorting: true,
    },
    {
      accessorKey: "tender_number",
      header: "Tender Number",
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: "Date",
      enableSorting: true,
    },
    {
      accessorKey: "guarantee_no",
      header: "Guarantee No",
      enableSorting: true,
    },
    {
      accessorKey: "guarantor",
      header: "Guarantor",
      enableSorting: true,
    },
    {
      accessorKey: "applicant",
      header: "Applicant",
      enableSorting: true,
    },
    {
      accessorKey: "tender_amount",
      header: "Tender Amount",
      enableSorting: true,
    },
    {
      accessorKey: "expiry_date",
      header: "Expiry Date",
      enableSorting: true,
    },
    {
      accessorKey: "document_url",
      header: "Document URL",
      enableSorting: true,
      cell: ({ row }) => (
        <a href={row.original.document_url} target="_blank" rel="noopener noreferrer">
          View Document
        </a>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => onEditClick(row.original)}>
            <FaEdit className="text-green-500 cursor-pointer" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {/* Search Input */}
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search tender documents."
        className="border p-2 rounded w-1/2"
      />

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {/* Custom Sorting Icons */}
                    {header.column.getCanSort() && (
                      <span>
                        {header.column.getIsSorted() === "asc" ? (
                          <PiSortAscendingThin />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <PiSortDescendingThin />
                        ) : (
                          <PiSortDescendingThin /> // Default to desc icon
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #ddd" }}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ padding: "10px", textAlign: "left" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenderDocumentsTable;