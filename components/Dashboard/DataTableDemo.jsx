"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Spinner } from "../spiner"

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("sku")}</div>
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    TITLE
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "vendor",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    VENDOR
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase text-center">{row.getValue("vendor")}</div>,
    },
    {
        accessorKey: "custom_colectia",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Metafield custom.colectia
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase text-center">{row.getValue("custom_colectia")}</div>,
    },
    {
        accessorKey: "price",
        header: () => <div className="text-center">PRICE($)</div>,
        cell: ({ row }) => (
            <input
                type="number"
                placeholder="Enter Discount"
                defaultValue={row.getValue("price")}
                onBlur={(e) => {
                    const newPrice = e.target.value;
                    // Implement your update logic here
                    console.log(`New price for ${row.original.id} is: ${newPrice}`);
                }}
                className="text-center max-w-40 border-none bg-transparent"
            />
        ),
    },
    {
        accessorKey: "com_price",
        header: () => <div className="text-center">COMPARE PRICE $</div>,
        cell: ({ row }) => <input
            type="number"
            placeholder="Raise Price"
            defaultValue={row.getValue("com_price")}
            onBlur={(e) => {
                const newComPrice = e.target.value;
                // Implement your update logic here
                console.log(`New compare price for ${row.original.id} is: ${newComPrice}`);
            }}
            className="text-center max-w-40 border-none bg-transparent"
        />
    },
    {
        accessorKey: "discount",
        header: () => <div className="text-center">Discount %</div>,
        cell: ({ row }) => (
            <input
                type="number"
                placeholder="Enter Discount"
                defaultValue={row.getValue("discount")}
                onBlur={(e) => {
                    const newDiscount = e.target.value;
                    // Implement your update logic here
                    console.log(`New discount for ${row.original.id} is: ${newDiscount}`);
                }}
                className="text-center max-w-40 border-none bg-transparent"
            />
        ),
    },
    {
        accessorKey: "raise",
        header: () => <div className="text-center">RAISE %</div>,
        cell: ({ row }) => (
            <input
                type="number"
                placeholder="Raise Price"
                defaultValue={row.getValue("raise")}
                onBlur={(e) => {
                    const newRaise = e.target.value;
                    // Implement your update logic here
                    console.log(`New raise for ${row.original.id} is: ${newRaise}`);
                }}
                className="text-center max-w-40 border-none bg-transparent"
            />
        ),
    },
]

export function DataTableDemo({ loading, data, onPageChange, currentPage }) {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: (row, columnIds, filterValue) => {
            // if there's no filterValue, don't filter anything
            if (!filterValue.trim()) {
                return true;
            }

            // Convert the current filter value to a lower case string for comparison
            const lowerCaseFilterValue = filterValue.toString().toLowerCase();

            // Check if vendor or price contains the filter string, convert to strings and to lowercase to make the search case-insensitive
            const containsVendor = row.getValue('vendor').toString().toLowerCase().includes(lowerCaseFilterValue);
            const containsPrice = row.getValue('price').toString().toLowerCase().includes(lowerCaseFilterValue);
            return containsVendor || containsPrice;
        },
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })
    const vendorFilterValue = (table.getColumn('vendor')?.getFilterValue()) ?? '';
    const priceFilterValue = (table.getColumn('price')?.getFilterValue()) ?? '';

    const filterValue = vendorFilterValue; // or some combination if using multiple filters

    const handleFilterChange = (value) => {
        // Update the filter for the 'vendor' column
        table.getColumn('vendor').setFilterValue(value);

        // If you also want to filter the 'price' column simultaneously,
        // uncomment the following line:
        table.getColumn('price').setFilterValue(value);
    };

    const updateData = () => {
        console.log('sdsd');
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by product title"
                    value={filterValue}
                    onChange={(event) => handleFilterChange(event.target.value)}
                    className=" max-w-3xl"
                />
                <Button variant="outline" className="ml-auto">
                    Filter by vendor <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="ml-auto">
                    Filter by metafield (custom.colectia) <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <Button onClick={updateData} className="ml-3">Save & Update</Button>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            loading ? (
                                <tr> {/* Add this line */}
                                    <td colSpan={columns.length}> {/* Adjust colSpan as needed */}
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() ? "selected" : undefined}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        }
                    </TableBody>

                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage}</span>
                    <Button
                        variant="outline"
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
