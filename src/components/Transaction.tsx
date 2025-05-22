"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, Download, PlusCircle, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define transaction interface
interface Transaction {
    id: string
    date: string
    customer: string
    amount: number
    status: "Completed" | "Pending" | "Failed"
    paymentMethod: string
}

// Generate a unique ID
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9)
}

// Format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

// Format date
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
    {
        id: generateId(),
        date: "2023-05-01",
        customer: "John Doe",
        amount: 245.99,
        status: "Completed",
        paymentMethod: "Credit Card",
    },
    {
        id: generateId(),
        date: "2023-05-02",
        customer: "Jane Smith",
        amount: 125.5,
        status: "Completed",
        paymentMethod: "PayPal",
    },
    {
        id: generateId(),
        date: "2023-05-03",
        customer: "Robert Johnson",
        amount: 450,
        status: "Pending",
        paymentMethod: "Bank Transfer",
    },
    {
        id: generateId(),
        date: "2023-05-04",
        customer: "Emily Davis",
        amount: 89.99,
        status: "Failed",
        paymentMethod: "Credit Card",
    },
    {
        id: generateId(),
        date: "2023-05-05",
        customer: "Michael Wilson",
        amount: 320.75,
        status: "Completed",
        paymentMethod: "PayPal",
    },
]

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)
    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
        date: new Date().toISOString().split("T")[0],
        customer: "",
        amount: 0,
        status: "Pending",
        paymentMethod: "",
    })

    // Load transactions from localStorage on component mount
    useEffect(() => {
        const storedTransactions = localStorage.getItem("transactions")
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions))
        } else {
            // Initialize with sample data if no data exists
            setTransactions(sampleTransactions)
            localStorage.setItem("transactions", JSON.stringify(sampleTransactions))
        }
    }, [])

    // Save transactions to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions))
    }, [transactions])

    // Filter transactions based on search term and status filter
    const filteredTransactions = transactions.filter(
        (transaction) =>
            (transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === "all" || transaction.status === statusFilter),
    )

    // Add a new transaction
    const handleAddTransaction = () => {
        const transaction: Transaction = {
            id: generateId(),
            ...newTransaction,
        }
        setTransactions([transaction, ...transactions])
        setIsAddDialogOpen(false)
        resetNewTransaction()
    }

    // Edit an existing transaction
    const handleEditTransaction = () => {
        if (currentTransaction) {
            setTransactions(transactions.map((t) => (t.id === currentTransaction.id ? { ...currentTransaction } : t)))
            setIsEditDialogOpen(false)
            setCurrentTransaction(null)
        }
    }

    // Delete a transaction
    const handleDeleteTransaction = () => {
        if (currentTransaction) {
            setTransactions(transactions.filter((t) => t.id !== currentTransaction.id))
            setIsDeleteDialogOpen(false)
            setCurrentTransaction(null)
        }
    }

    // Reset new transaction form
    const resetNewTransaction = () => {
        setNewTransaction({
            date: new Date().toISOString().split("T")[0],
            customer: "",
            amount: 0,
            status: "Pending",
            paymentMethod: "",
        })
    }

    return (
        <div className="flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Transaction</DialogTitle>
                                <DialogDescription>Enter the details for the new transaction.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newTransaction.date}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="customer">Customer</Label>
                                    <Input
                                        id="customer"
                                        value={newTransaction.customer}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, customer: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        value={newTransaction.amount}
                                        onChange={(e) =>
                                            setNewTransaction({ ...newTransaction, amount: Number.parseFloat(e.target.value) })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={newTransaction.status}
                                        onValueChange={(value) =>
                                            setNewTransaction({
                                                ...newTransaction,
                                                status: value as "Completed" | "Pending" | "Failed",
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Input
                                        id="paymentMethod"
                                        value={newTransaction.paymentMethod}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddTransaction}>Add Transaction</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction Management</CardTitle>
                    <CardDescription>View and manage all transactions in your system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search transactions..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                                            <TableCell>{formatDate(transaction.date)}</TableCell>
                                            <TableCell>{transaction.customer}</TableCell>
                                            <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                            <TableCell>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                transaction.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                            }`}
                        >
                          {transaction.status}
                        </span>
                                            </TableCell>
                                            <TableCell>{transaction.paymentMethod}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setCurrentTransaction(transaction)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            Edit transaction
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setCurrentTransaction(transaction)
                                                                setIsDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            Delete transaction
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Transaction Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                        <DialogDescription>Update the transaction details.</DialogDescription>
                    </DialogHeader>
                    {currentTransaction && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-date">Date</Label>
                                <Input
                                    id="edit-date"
                                    type="date"
                                    value={currentTransaction.date}
                                    onChange={(e) => setCurrentTransaction({ ...currentTransaction, date: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-customer">Customer</Label>
                                <Input
                                    id="edit-customer"
                                    value={currentTransaction.customer}
                                    onChange={(e) => setCurrentTransaction({ ...currentTransaction, customer: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-amount">Amount</Label>
                                <Input
                                    id="edit-amount"
                                    type="number"
                                    step="0.01"
                                    value={currentTransaction.amount}
                                    onChange={(e) =>
                                        setCurrentTransaction({ ...currentTransaction, amount: Number.parseFloat(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    value={currentTransaction.status}
                                    onValueChange={(value) =>
                                        setCurrentTransaction({
                                            ...currentTransaction,
                                            status: value as "Completed" | "Pending" | "Failed",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-paymentMethod">Payment Method</Label>
                                <Input
                                    id="edit-paymentMethod"
                                    value={currentTransaction.paymentMethod}
                                    onChange={(e) => setCurrentTransaction({ ...currentTransaction, paymentMethod: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditTransaction}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the transaction. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTransaction} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Transactions
