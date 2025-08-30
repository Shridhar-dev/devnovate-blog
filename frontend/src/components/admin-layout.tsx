import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./auth-context"
 
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth()
      const navigate = useNavigate()
    useEffect(() => {
        if (user === null) {
          navigate("/login")
        }
      }, [user, authLoading, navigate])
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
       
        <div className="flex-1 w-full p-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}