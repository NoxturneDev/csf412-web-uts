"use client"

import React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Download, Search, UserPlus } from "lucide-react"

// Define customer interface
interface Customer {
  id: number
  name: string
  email: string
  status: "Active" | "Inactive"
  spent: string
  lastOrder: string
}

// Sample customer data
const customers: Customer[] = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active", spent: "$2,456.00", lastOrder: "2023-05-01" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    spent: "$1,789.00",
    lastOrder: "2023-05-03",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    status: "Inactive",
    spent: "$890.00",
    lastOrder: "2023-04-15",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    status: "Active",
    spent: "$3,421.00",
    lastOrder: "2023-05-07",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael@example.com",
    status: "Active",
    spent: "$1,245.00",
    lastOrder: "2023-05-02",
  },
  {
    id: 6,
    name: "Sarah Brown",
    email: "sarah@example.com",
    status: "Inactive",
    spent: "$567.00",
    lastOrder: "2023-04-10",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david@example.com",
    status: "Active",
    spent: "$2,890.00",
    lastOrder: "2023-05-05",
  },
  {
    id: 8,
    name: "Lisa Taylor",
    email: "lisa@example.com",
    status: "Active",
    spent: "$1,678.00",
    lastOrder: "2023-05-04",
  },
  {
    id: 9,
    name: "James Anderson",
    email: "james@example.com",
    status: "Inactive",
    spent: "$432.00",
    lastOrder: "2023-04-20",
  },
  {
    id: 10,
    name: "Jennifer Thomas",
    email: "jennifer@example.com",
    status: "Active",
    spent: "$3,210.00",
    lastOrder: "2023-05-06",
  },
]

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>Manage your customer base and their information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
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
          </div>

          <div className="rounded-md border">
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
                {filteredCustomers.map((customer) => (
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
                    <TableCell>{customer.spent}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
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
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete customer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
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
    </div>
  )
}

export default Customers
