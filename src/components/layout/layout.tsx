"use client"

import type React from "react"
import type {ReactNode} from "react"

import {Bell, CreditCard, Home, LogOut, Package, Search, UserPlus, Users} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useNavigate} from "react-router-dom"
import {Suspense} from "react"

interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className="flex items-center gap-2 md:ml-auto md:gap-4">
                    <div className="hidden md:flex">
                        <div className="text-lg font-semibold">Admin Dashboard</div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="hidden w-full appearance-none bg-background pl-8 shadow-none md:flex md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Bell className="h-5 w-5"/>
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <img
                                        src="/placeholder.svg?height=32&width=32"
                                        width="32"
                                        height="32"
                                        className="rounded-full"
                                        alt="Avatar"
                                    />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="hidden w-[240px] flex-col border-r bg-background md:flex">
                    <nav className="flex flex-col gap-4 py-4">
                        <Button
                            variant="ghost"
                            className="flex items-center justify-start gap-2 px-4"
                            onClick={() => navigate("/")}
                        >
                            <Home className="h-5 w-5"/>
                            Dashboard
                        </Button>
                        <Button
                            onClick={() => navigate("/customers")}
                            variant="ghost"
                            className="flex items-center justify-start gap-2 px-4"
                        >
                            <Users className="h-5 w-5"/>
                            Customers
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center justify-start gap-2 px-4"
                            onClick={() => navigate("/transactions")}
                        >
                            <CreditCard className="h-5 w-5"/>
                            Transactions
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center justify-start gap-2 px-4"
                            onClick={() => navigate("/users")}
                        >
                            <UserPlus className="h-5 w-5"/>
                            Users
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center justify-start gap-2 px-4"
                            onClick={() => navigate("/products")}
                        >
                            <Package className="h-5 w-5"/>
                            Products
                        </Button>
                    </nav>
                </aside>
                <main className="flex-1">
                    <Suspense>{children}</Suspense>
                </main>
            </div>
        </div>
    )
}

export default Layout
