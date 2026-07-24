import { ISidebarItem } from "@/lib/types"
import { FileText, LayoutDashboard } from "lucide-react"

const USER_SIDEBAR_ITEMS : ISidebarItem[] = [
    { label : "dashboard", href:'/dashboard', icon : LayoutDashboard},
    { label : "My Posts", href:'/dashboard/my-posts', icon : FileText},
]

const AUTHOR_SIDEBAR_ITEMS : ISidebarItem[] = [
    { label : "Author dashboard", href:'/author-dashboard', icon : LayoutDashboard},
    { label : "My Posts", href:'/author-dashboard/my-posts', icon : FileText},
]

const ADMIN_SIDEBAR_ITEMS : ISidebarItem[] = [
    { label : "Admin dashboard", href:'/admin-dashboard', icon : LayoutDashboard},
    { label : "My Posts", href:'/admin-dashboard/my-posts', icon : FileText},
]

export const sidebarMenuItems = {
    USER : USER_SIDEBAR_ITEMS,
    AUTHOR : AUTHOR_SIDEBAR_ITEMS,
    ADMIN : ADMIN_SIDEBAR_ITEMS
}