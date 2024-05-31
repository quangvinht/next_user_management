import { User } from "@/types/user";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { useDeleteUser, useSearchUser } from "@/hooks/userHook";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const UserTable = ({ users }: { users: User[] | undefined }) => {
  const [tableData, setTableData] = useState<User[] | undefined>(users);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const usernameFilter =
    columnFilters.find((filter) => filter.id === "username")?.value || "";
  const { data: searchResults, refetch } = useSearchUser(
    usernameFilter.toString(),
    users
  );

  const deleteUser = useDeleteUser();

  const router = useRouter();

  const columns: ColumnDef<User>[] = [
    {
      header: "ID",
      accessorKey: "_id",
      cell: ({ row }) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => handleViewUser(row.original)}
        >
          {row.original._id}
        </button>
      ),
    },
    {
      header: "Username",
      accessorKey: "username",
      cell: ({ row }) => (
        <button
          onClick={() => handleViewUser(row.original)}
          className="text-blue-500 hover:underline"
        >
          {row.original.username}
        </button>
      ),
    },
    {
      header: "Fullname",
      accessorKey: "fullname",
      cell: ({ row }) => row.original.fullname,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => row.original.role,
    },
    {
      header: "Project",
      accessorKey: "project",
      // cell: ({ row }) => row.original.project.join(", "),
    },
    {
      header: "Active",
      accessorKey: "activeYn",
      cell: ({ row }) => (
        <div
          className={`rounded-full p-2 text-white text-center ${
            row.original.activeYn === "Y" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.original.activeYn}
        </div>
      ),
    },
    {
      header: "Edit",
      cell: ({ row }) => (
        <button
          className="text-blue-500 hover:underline flex items-center"
          onClick={() => handleEditUser(row.original)}
        >
          <PencilIcon className="w-5 h-5 mr-1" />
        </button>
      ),
    },
    {
      header: "Delete",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.username)}
          className="text-red-500 hover:underline flex items-center"
        >
          <TrashIcon className="w-5 h-5 mr-1" />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: tableData || [],
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    columnResizeMode: "onChange",
  });

  useEffect(() => {
    if (usernameFilter.toString()) {
      setTableData(searchResults);
      refetch();
    }
    setTableData(users);
  }, [usernameFilter, refetch, searchResults, users]);

  const handleViewUser = (user: User) => {
    router.push({
      pathname: `/users/${user.username}`,
      query: { user: JSON.stringify(user) },
    });
  };

  const handleEditUser = (user: User) => {
    router.push({
      pathname: `/users/edit/${user.username}`,
      query: { user: JSON.stringify(user) },
    });
  };

  const handleDelete = (username: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(username);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnFilters([{ id: "username", value: e.target.value }]);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 w-full">
      <div className="flex  gap-2">
        <div className="flex flex-1 items-center bg-white p-2 rounded-md shadow-sm">
          <MagnifyingGlassIcon color="gray" className="w-6 h-full " />
          <input
            type="text"
            value={usernameFilter.toString()}
            onChange={handleFilterChange}
            placeholder="Search by username..."
            className={`flex-1 w-full p-2 bg-white ${
              !usernameFilter.toString() ? "border-none" : ""
            } rounded-md outline-none focus:border-none`}
          />
        </div>
        <button
          onClick={() => router.push("/users/create")}
          className="flex items-center bg-blue-500 text-white rounded-md px-4 py-2 shadow hover:bg-blue-600"
        >
          <PlusCircleIcon className="w-6 h-full mr-1" /> Create User
        </button>
      </div>
      <Table
        className={`bg-slate-100 space-y-2 border-2 border-slate-300 rounded-lg`}
      >
        <TableHeader className="bg-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b-2 border-slate-300"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className=" py-2 font-bold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`hover:bg-slate-200 border-b-2  border-slate-300 p-10`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-8 border-r-2 border-slate-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-b-2 border-slate-300 ">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
