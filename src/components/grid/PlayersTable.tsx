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
import { FaEdit, FaTrash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

type Player = {
  player_id: number;
  player_name: string;
  phone: number;
  national_id: number;
  account_balance: number;
  account_bonus: number;
  player_points: number;
  player_status: number;
  createdon: number;
};

// Table component
const PlayersTable: React.FC<{ data: Player[] }> = ({ data }) => {
  // const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Define columns
  const columns: ColumnDef<Player>[] = [
    {
      accessorKey: "player_id",
      header: "ID",
      enableSorting: true,
    },
    // {
    //   accessorKey: "player_name",
    //   header: "Name",
    //   enableSorting: true,
    // },
    {
      accessorKey: "phone",
      header: "Phone",
      enableSorting: true,
    },
   
    {
      accessorKey: "account_balance",
      header: "Account Balance",
      enableSorting: true,
    },
    {
      accessorKey: "account_bonus",
      header: "Account Bonus",
      enableSorting: true,
    },
    {
        accessorKey: "player_points",
        header: "Player Points",
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

  // // Action handlers
  // const handleView = (player: Player) => {
  //   console.log("View:", player);
  //   navigate(`/games/${player?.player_id}`);
  // };
  

  const handleEdit = (player: Player) => {
    console.log("Edit:", player);
  };

  const handleDelete = (player: Player) => {
    console.log("Delete:", player);
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

export default PlayersTable;
