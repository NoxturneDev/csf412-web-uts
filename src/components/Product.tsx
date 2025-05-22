"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
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
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea"
import { Search, MoreHorizontal, Download, PlusCircle, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define product interface
interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    stock: number
    status: "In Stock" | "Low Stock" | "Out of Stock"
    createdAt: string
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

// Sample product data
const sampleProducts: Product[] = [
    {
        id: generateId(),
        name: "Wireless Headphones",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
        price: 199.99,
        category: "Electronics",
        stock: 45,
        status: "In Stock",
        createdAt: "2023-04-15",
    },
    {
        id: generateId(),
        name: "Smart Watch",
        description: "Fitness tracker with heart rate monitoring and sleep analysis.",
        price: 149.99,
        category: "Electronics",
        stock: 28,
        status: "In Stock",
        createdAt: "2023-04-20",
    },
    {
        id: generateId(),
        name: "Bluetooth Speaker",
        description: "Portable waterproof speaker with 360-degree sound.",
        price: 79.99,
        category: "Electronics",
        stock: 5,
        status: "Low Stock",
        createdAt: "2023-04-25",
    },
    {
        id: generateId(),
        name: "Laptop Backpack",
        description: "Water-resistant backpack with anti-theft features and USB charging port.",
        price: 59.99,
        category: "Accessories",
        stock: 0,
        status: "Out of Stock",
        createdAt: "2023-05-01",
    },
    {
        id: generateId(),
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with adjustable DPI settings.",
        price: 29.99,
        category: "Electronics",
        stock: 62,
        status: "In Stock",
        createdAt: "2023-05-05",
    },
]

// Sample categories
const categories = ["Electronics", "Accessories", "Clothing", "Home", "Books", "Sports", "Other"]

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
    const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "createdAt">>({
        name: "",
        description: "",
        price: 0,
        category: "Electronics",
        stock: 0,
        status: "In Stock",
    })

    // Load products from localStorage on component mount
    useEffect(() => {
        const storedProducts = localStorage.getItem("products")
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts))
        } else {
            // Initialize with sample data if no data exists
            setProducts(sampleProducts)
            localStorage.setItem("products", JSON.stringify(sampleProducts))
        }
    }, [])

    // Save products to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products))
    }, [products])

    // Filter products based on search term, category filter, and status filter
    const filteredProducts = products.filter(
        (product) =>
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (categoryFilter === "all" || product.category === categoryFilter) &&
            (statusFilter === "all" || product.status === statusFilter),
    )

    // Add a new product
    const handleAddProduct = () => {
        const product: Product = {
            id: generateId(),
            ...newProduct,
            createdAt: new Date().toISOString().split("T")[0],
        }
        setProducts([product, ...products])
        setIsAddDialogOpen(false)
        resetNewProduct()
    }

    // Edit an existing product
    const handleEditProduct = () => {
        if (currentProduct) {
            setProducts(products.map((p) => (p.id === currentProduct.id ? { ...currentProduct } : p)))
            setIsEditDialogOpen(false)
            setCurrentProduct(null)
        }
    }

    // Delete a product
    const handleDeleteProduct = () => {
        if (currentProduct) {
            setProducts(products.filter((p) => p.id !== currentProduct.id))
            setIsDeleteDialogOpen(false)
            setCurrentProduct(null)
        }
    }

    // Update product status based on stock
    const updateProductStatus = (product: Product): Product => {
        let status: "In Stock" | "Low Stock" | "Out of Stock"
        if (product.stock <= 0) {
            status = "Out of Stock"
        } else if (product.stock <= 5) {
            status = "Low Stock"
        } else {
            status = "In Stock"
        }
        return { ...product, status }
    }

    // Handle stock change and update status
    const handleStockChange = (value: number, isNewProduct = false) => {
        if (isNewProduct) {
            let status: "In Stock" | "Low Stock" | "Out of Stock"
            if (value <= 0) {
                status = "Out of Stock"
            } else if (value <= 5) {
                status = "Low Stock"
            } else {
                status = "In Stock"
            }
            setNewProduct({ ...newProduct, stock: value, status })
        } else if (currentProduct) {
            const updatedProduct = updateProductStatus({ ...currentProduct, stock: value })
            setCurrentProduct(updatedProduct)
        }
    }

    // Reset new product form
    const resetNewProduct = () => {
        setNewProduct({
            name: "",
            description: "",
            price: 0,
            category: "Electronics",
            stock: 0,
            status: "In Stock",
        })
    }

    return (
        <div className="flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                                <DialogDescription>Enter the details for the new product.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={newProduct.category}
                                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => handleStockChange(Number.parseInt(e.target.value), true)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddProduct}>Add Product</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>View and manage all products in your inventory.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="In Stock">In Stock</SelectItem>
                                        <SelectItem value="Low Stock">Low Stock</SelectItem>
                                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{formatCurrency(product.price)}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                product.status === "In Stock"
                                    ? "bg-green-100 text-green-800"
                                    : product.status === "Low Stock"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                            }`}
                        >
                          {product.status}
                        </span>
                                            </TableCell>
                                            <TableCell>{formatDate(product.createdAt)}</TableCell>
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
                                                                setCurrentProduct(product)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            Edit product
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setCurrentProduct(product)
                                                                setIsDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            Delete product
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

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>Update the product details.</DialogDescription>
                    </DialogHeader>
                    {currentProduct && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={currentProduct.description}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-price">Price</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    value={currentProduct.price}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select
                                    value={currentProduct.category}
                                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-stock">Stock</Label>
                                <Input
                                    id="edit-stock"
                                    type="number"
                                    value={currentProduct.stock}
                                    onChange={(e) => handleStockChange(Number.parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditProduct}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the product. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Products
