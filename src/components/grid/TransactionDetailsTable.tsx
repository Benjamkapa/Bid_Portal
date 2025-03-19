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
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Transaction = {
  game_id: number;
  game_name: string;
  player_name: string;
  v_ticket_id: string;
  dvd_id: number;
  mpesa_ref: string;
  voucher_price: number;
  ticket_price: number;
  charge_status: number;
  createdon: number;
};

// Table component
const TransactionDetailsTable: React.FC<{ data: Transaction[] }> = ({ data }) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Define columns
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "game_id",
      header: "Game Id",
      enableSorting: true,
    },
    {
     accessorKey: "player_name",
     header: "Player Name",
       enableSorting: true,
     },
     {
        accessorKey: "game_name",
        header: "Game Name",
          enableSorting: true,
        },
    {
      accessorKey: " v_ticket_id",
      header: "Ticket Id",
      enableSorting: true,
    },
   
    {
      accessorKey: "dvd_id",
      header: "DVD Id",
      enableSorting: true,
    },
    {
      accessorKey: "mpesa_ref",
      header: "M-pesa REF",
      enableSorting: true,
    },
    {
        accessorKey: "player_amount",
        header: "Player amount",
        enableSorting: true,
      },
      {
        accessorKey: "voucher_price",
        header: "Voucher Price",
        enableSorting: true,
      },

      {
        accessorKey: "ticket_price",
        header: "Ticket Price",
        enableSorting: true,
      },
      
    {
      accessorKey: "createdon",
      header: "Created On",
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {/* <button onClick={() => handleView(row.original)}>
            <FaEye className="text-blue-500 cursor-pointer" />
          </button> */}
          <button onClick={() => handleEdit(row.original)}>
            <FaEdit className="text-green-500 cursor-pointer" />
          </button>
          <button onClick={() => handleDelete(row.original)}>
            <FaTrash className="text-red-500 cursor-pointer" />
          </button>
        </div>
      ),
    },
  ];

  // Initialize the table
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


 

  const handleEdit = (transaction: Transaction) => {
    console.log("Edit:", transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    console.log("Delete:", transaction);
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {/* Search Input */}
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search player."
        // style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        className="border p-2  rounded w-1/2"
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

export default TransactionDetailsTable;
