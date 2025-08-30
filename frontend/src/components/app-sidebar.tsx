import { ChartNoAxesColumnIncreasing, LogOut, Pencil, StickyNote, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "./auth-context"

// Menu items.
const items = [
  {
    title: "Analytics",
    url: "/admin",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: StickyNote,
  },
  {
    title: "Write",
    url: "/write",
    icon: Pencil,
  },
  {
    title: "Profile",
    url: "/admin/profile",
    icon: User,
  },
  
]

export function AppSidebar() {
  const { logout } = useAuth()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem key={"Logout"}>
                  <SidebarMenuButton onClick={logout} asChild>
                    <p className="cursor-pointer flex items-center gap-2">
                        <LogOut/>
                        <span>Logout</span>
                    </p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}