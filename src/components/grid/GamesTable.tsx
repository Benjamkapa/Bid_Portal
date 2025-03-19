import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import { PiSortAscendingThin, PiSortDescendingThin } from 'react-icons/pi';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


type Game = {
  game_id: number;
  game_name: string;
  game_description: string;
  game_status: number;
  winner_amount: string;
  win_factor: string;
  createdon: number;
  

};

// Table component
const GamesTable: React.FC<{ data: Game[], handleOpenModal: (game: Game) => void  }> = ({ data,handleOpenModal }) => {
    const navigate=useNavigate()
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Define columns
  const columns: ColumnDef<Game>[] = [
    {
      accessorKey: 'game_id',
      header: 'ID',
      enableSorting: true,
    },
    {
      accessorKey: 'game_name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'game_description',
      header: 'Description',
      enableSorting: true,
    },
    {
      accessorKey: 'game_status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-lg ${
            row.original.game_status === 1
              ? "text-green-600 bg-green-100"
              : "text-red-600 bg-red-100"
          }`}
        >
          {row.original.game_status === 1 ? "active" : "inactive"}
        </span>
      ),
    }
    ,
    {
      accessorKey: 'winner_amount',
      header: 'Winner Amount',
      enableSorting: true,
    },
    {
      accessorKey: 'win_factor',
      header: 'Win Factor',
      enableSorting: true,
    },
    {
      accessorKey: 'createdon',
      header: 'Created On',
      enableSorting: true,
      
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleView(row.original)}>
            <FaEye className='text-blue-500 cursor-pointer'  />

          </button>
          <button onClick={() => handleEdit(row.original)}>
            <FaEdit className='text-green-500 cursor-pointer' />
          </button>
          <button onClick={() => handleDelete(row.original)}>
            <FaTrash className='text-red-500 cursor-pointer'/>
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

  // Action handlers
  const handleView = (game: Game) => {
    console.log('View:', game);
  navigate(`/games/${game?.game_id}`)
  };

  const handleEdit = (game:Game) => {
    handleOpenModal(game);
  };

  // const handleDelete = (game: Game) => {
  //   console.log('Delete:', game);
  // };

  const handleDelete = async (game: Game) => {
    if (!window.confirm(`Are you sure you want to delete ${game.game_name}?`)) return;
    
    try {
      // await axios.delete(`${API_URL}/games/${game.game_id}`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      //   },
      // });
      // toast.success("Game deleted successfully");
      // refreshGames();
    } catch (error) {
      // toast.error("Failed to delete game");
    }
  };





  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {/* Search Input */}
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search game."
        // style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        className='border p-2  rounded w-1/2'
      />

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #ddd',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
       
                    {header.column.getCanSort() && (
                      <span>
                        {header.column.getIsSorted() === 'asc' ? (
                          <PiSortAscendingThin />
                        ) : header.column.getIsSorted() === 'desc' ? (
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
            <tr key={row.id} style={{ borderBottom: '1px solid #ddd' }}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ padding: '10px', textAlign: 'left' }}
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

export default GamesTable;

