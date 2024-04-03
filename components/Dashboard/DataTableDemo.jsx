"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
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
    DropdownMenuRadioItem,
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

export function DataTableDemo({ loading, data, pageSize, vendors, allProducts, updateVariantsPrice, updatingFlag }) {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: pageSize,
    })
    const [changedRowsObject, setChangedRowsObject] = React.useState({});
    
    const columns = [
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
                    placeholder="Price"
                    defaultValue={row.getValue("price")}
                    onBlur={(e) => {
                        const newPrice = e.target.value;
                        // Implement your update logic here
                        console.log(`New price for ${row.original.id} is: ${newPrice}`);
                        let inputedRowIndex = data.findIndex(v => v.id == row.original.id);
                        data[inputedRowIndex]['price'] = parseFloat(newPrice);
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
                placeholder="Compare Price"
                defaultValue={row.getValue("com_price")}
                onBlur={(e) => {
                    const newComPrice = e.target.value;
                    // Implement your update logic here
                    console.log(`New compare price for ${row.original.id} is: ${newComPrice}`);
                    let inputedRowIndex = data.findIndex(v => v.id == row.original.id);
                    data[inputedRowIndex]['com_price'] = parseFloat(newComPrice);
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

    const table = useReactTable({
        data,
        columns,
        debugTable: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
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
            const containsTitle = row.getValue('title').toString().toLowerCase().includes(lowerCaseFilterValue);
            return containsTitle;
        },
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination,
        },
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    })
    const titleFilterValue = (table.getColumn('title')?.getFilterValue()) ?? '';

    const filterValue = titleFilterValue; // or some combination if using multiple filters

    const handleFilterChange = (value) => {
        console.log('value', value);
        // Update the filter for the 'vendor' column
        table.getColumn('title').setFilterValue(value);

        // If you also want to filter the 'price' column simultaneously,
        // uncomment the following line:
    };

    const filterByVendor = (vendor) => {
        console.log('vendor', vendor);
        // Update the filter for the 'vendor' column
        // table.getColumn('vendor').setFilterValue(vendor);
    }

    const updateData = () => {
        // console.log('data',data, allProducts, pagination);
        let length = allProducts.length;
        let changedVariants = []
        for (let i=0; i< length; i++) {
            if (allProducts[i].price != data[i].price || allProducts[i].com_price != data[i].com_price) {
                changedVariants.push({
                    id: data[i]['id'], 
                    price: data[i]['price'], 
                    com_price: data[i]['com_price']
                });
            }
        }
        console.log('changedVariants', changedVariants);
        if (changedVariants.length > 0) {
            updateVariantsPrice(changedVariants);
        }
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
                {/* <Button variant="outline" className="ml-auto">
                    Filter by vendor <ChevronDown className="ml-2 h-4 w-4" />
                </Button> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Filter by vendor <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {vendors.length > 0 && vendors
                            .map((vendor, index) => {
                                return (
                                    <DropdownMenuRadioItem
                                        key={index}
                                        className="capitalize"
                                        onClick={(e) => filterByVendor(vendor)}
                                    >
                                        {vendor}
                                    </DropdownMenuRadioItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="ml-auto">
                    Filter by metafield (custom.colectia) <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <Button onClick={updateData} className={`ml-3 ${!!updatingFlag ? 'opacity-50' : ''}`}>Save & Update</Button>
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
                                <tr className="h-48"> {/* Add this line */}
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
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <span>Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString() ?? ' '}</span>
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
