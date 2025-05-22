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
import { MoreHorizontal, Download, Search, UserPlus, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define customer interface
interface Customer {
    id: string
    name: string
    email: string
    status: "Active" | "Inactive"
    spent: number
    lastOrder: string
    phone: string
    address: string
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

// Sample customer data
const sampleCustomers: Customer[] = [
    {
        id: generateId(),
        name: "John Doe",
        email: "john@example.com",
        status: "Active",
        spent: 2456.0,
        lastOrder: "2023-05-01",
        phone: "(555) 123-4567",
        address: "123 Main St, Anytown, CA 12345",
    },
    {
        id: generateId(),
        name: "Jane Smith",
        email: "jane@example.com",
        status: "Active",
        spent: 1789.0,
        lastOrder: "2023-05-03",
        phone: "(555) 234-5678",
        address: "456 Oak Ave, Somewhere, NY 67890",
    },
    {
        id: generateId(),
        name: "Robert Johnson",
        email: "robert@example.com",
        status: "Inactive",
        spent: 890.0,
        lastOrder: "2023-04-15",
        phone: "(555) 345-6789",
        address: "789 Pine Rd, Nowhere, TX 54321",
    },
    {
        id: generateId(),
        name: "Emily Davis",
        email: "emily@example.com",
        status: "Active",
        spent: 3421.0,
        lastOrder: "2023-05-07",
        phone: "(555) 456-7890",
        address: "321 Elm Blvd, Elsewhere, FL 13579",
    },
    {
        id: generateId(),
        name: "Michael Wilson",
        email: "michael@example.com",
        status: "Active",
        spent: 1245.0,
        lastOrder: "2023-05-02",
        phone: "(555) 567-8901",
        address: "654 Maple Ln, Anywhere, WA 24680",
    },
    {
        id: generateId(),
        name: "Sarah Brown",
        email: "sarah@example.com",
        status: "Inactive",
        spent: 567.0,
        lastOrder: "2023-04-10",
        phone: "(555) 678-9012",
        address: "987 Cedar St, Someplace, IL 97531",
    },
    {
        id: generateId(),
        name: "David Miller",
        email: "david@example.com",
        status: "Active",
        spent: 2890.0,
        lastOrder: "2023-05-05",
        phone: "(555) 789-0123",
        address: "159 Birch Dr, Othertown, GA 86420",
    },
    {
        id: generateId(),
        name: "Lisa Taylor",
        email: "lisa@example.com",
        status: "Active",
        spent: 1678.0,
        lastOrder: "2023-05-04",
        phone: "(555) 890-1234",
        address: "753 Willow Way, Thisplace, MI 75319",
    },
    {
        id: generateId(),
        name: "James Anderson",
        email: "james@example.com",
        status: "Inactive",
        spent: 432.0,
        lastOrder: "2023-04-20",
        phone: "(555) 901-2345",
        address: "246 Aspen Ct, Thatplace, OR 95173",
    },
    {
        id: generateId(),
        name: "Jennifer Thomas",
        email: "jennifer@example.com",
        status: "Active",
        spent: 3210.0,
        lastOrder: "2023-05-06",
        phone: "(555) 012-3456",
        address: "864 Spruce Ave, Yourtown, AZ 15937",
    },
]

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
    const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({
        name: "",
        email: "",
        status: "Active",
        spent: 0,
        lastOrder: new Date().toISOString().split("T")[0],
        phone: "",
        address: "",
    })

    // Load customers from localStorage on component mount
    useEffect(() => {
        const storedCustomers = localStorage.getItem("customers")
        if (storedCustomers) {
            setCustomers(JSON.parse(storedCustomers))
        } else {
            // Initialize with sample data if no data exists
            setCustomers(sampleCustomers)
            localStorage.setItem("customers", JSON.stringify(sampleCustomers))
        }
    }, [])

    // Save customers to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("customers", JSON.stringify(customers))
    }, [customers])

    // Filter customers based on search term and status filter
    const filteredCustomers = customers.filter(
        (customer) =>
            (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === "all" || customer.status === statusFilter),
    )

    // Add a new customer
    const handleAddCustomer = () => {
        const customer: Customer = {
            id: generateId(),
            ...newCustomer,
        }
        setCustomers([customer, ...customers])
        setIsAddDialogOpen(false)
        resetNewCustomer()
    }

    // Edit an existing customer
    const handleEditCustomer = () => {
        if (currentCustomer) {
            setCustomers(customers.map((c) => (c.id === currentCustomer.id ? { ...currentCustomer } : c)))
            setIsEditDialogOpen(false)
            setCurrentCustomer(null)
        }
    }

    // Delete a customer
    const handleDeleteCustomer = () => {
        if (currentCustomer) {
            setCustomers(customers.filter((c) => c.id !== currentCustomer.id))
            setIsDeleteDialogOpen(false)
            setCurrentCustomer(null)
        }
    }

    // Reset new customer form
    const resetNewCustomer = () => {
        setNewCustomer({
            name: "",
            email: "",
            status: "Active",
            spent: 0,
            lastOrder: new Date().toISOString().split("T")[0],
            phone: "",
            address: "",
        })
    }

    return (
        <div className="flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                                <DialogDescription>Enter the details for the new customer.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={newCustomer.phone}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={newCustomer.address}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={newCustomer.status}
                                        onValueChange={(value) =>
                                            setNewCustomer({
                                                ...newCustomer,
                                                status: value as "Active" | "Inactive",
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="spent">Total Spent</Label>
                                    <Input
                                        id="spent"
                                        type="number"
                                        step="0.01"
                                        value={newCustomer.spent}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, spent: Number.parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastOrder">Last Order Date</Label>
                                    <Input
                                        id="lastOrder"
                                        type="date"
                                        value={newCustomer.lastOrder}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, lastOrder: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddCustomer}>Add Customer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>Manage your customer base and their information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search customers..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total Spent</TableHead>
                                    <TableHead>Last Order</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">{customer.name}</TableCell>
                                            <TableCell>{customer.email}</TableCell>
                                            <TableCell>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {customer.status}
                        </span>
                                            </TableCell>
                                            <TableCell>{formatCurrency(customer.spent)}</TableCell>
                                            <TableCell>{formatDate(customer.lastOrder)}</TableCell>
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
                                                                setCurrentCustomer(customer)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            Edit customer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                // View customer details logic
                                                                setCurrentCustomer(customer)
                                                                // You could navigate to a details page or show a modal
                                                            }}
                                                        >
                                                            View details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setCurrentCustomer(customer)
                                                                setIsDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            Delete customer
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

            <Card>
                <CardHeader>
                    <CardTitle>Customer Statistics</CardTitle>
                    <CardDescription>Overview of your customer base</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                            <p className="text-2xl font-bold">{customers.length}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                            <p className="text-2xl font-bold">{customers.filter((c) => c.status === "Active").length}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Inactive Customers</p>
                            <p className="text-2xl font-bold">{customers.filter((c) => c.status === "Inactive").length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Customer Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Customer</DialogTitle>
                        <DialogDescription>Update the customer details.</DialogDescription>
                    </DialogHeader>
                    {currentCustomer && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={currentCustomer.name}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={currentCustomer.email}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input
                                    id="edit-phone"
                                    value={currentCustomer.phone}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-address">Address</Label>
                                <Input
                                    id="edit-address"
                                    value={currentCustomer.address}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    value={currentCustomer.status}
                                    onValueChange={(value) =>
                                        setCurrentCustomer({
                                            ...currentCustomer,
                                            status: value as "Active" | "Inactive",
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-spent">Total Spent</Label>
                                <Input
                                    id="edit-spent"
                                    type="number"
                                    step="0.01"
                                    value={currentCustomer.spent}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, spent: Number.parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-lastOrder">Last Order Date</Label>
                                <Input
                                    id="edit-lastOrder"
                                    type="date"
                                    value={currentCustomer.lastOrder}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, lastOrder: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditCustomer}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the customer. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Customers
