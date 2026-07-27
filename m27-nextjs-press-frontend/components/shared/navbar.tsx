"use client";

import Link from "next/link";
import { CircleUser, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/service/logout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NavbarProps } from "@/lib/types";

// Organised Navigation Arrays
const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/servicess" },
  { label: "Contact", href: "/Contact" },
  { label: "News", href: "/news" },
  { label: "Premium", href: "/premium" },
];

const userMenuItems = [
  { label: "My Account", href: "/settings/account" },
  { label: "Support", href: "/support" },
  { label: "Settings", href: "/settings" },
];





export function Navbar({user} : NavbarProps) {

  const router = useRouter()

  const handleUserMenuAction = async (action : string) =>{

    if(action === "dashboard"){
      if(user.data.profile.role === "USER"){
        router.push('/dashboard')
      }
      else if(user.data.profile.role === "AUTHOR"){
        router.push('/author-dashboard')
      }
      else if(user.data.profile.role === "ADMIN"){
        router.push('/admin-dashboard')
      }

      return
    }

    if(action === "logout"){
      await logout();
      toast.success("log out successful!")
      router.push("/login")
      
    }
  }

 
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <div className="flex items-center min-w-[150px]">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="font-bold">Acme Corp</span>
          </Link>
        </div>

        {/* Middle: Centered Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: User Dropdown */}
        <div className="flex items-center justify-end min-w-[150px]">
          <div>
            <h1 className="mr-10">Likes : </h1>
          </div>
         {
          user.success ? ( <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user?.data?.profile?.email || "Guest"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Mapping through dropdown options */}
              {userMenuItems.map((menuItem) => (
                <DropdownMenuItem key={menuItem.href} asChild>
                  <Link href={menuItem.href} className="w-full cursor-pointer">
                    {menuItem.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer" onClick={async ()=> {
                await handleUserMenuAction("logout")
              }}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>) : <Link href={"/login"}> <Button variant={"default"}>login</Button></Link>
         }
        </div>

      </div>
    </header>
  );
}