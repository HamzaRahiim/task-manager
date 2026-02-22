import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function AppLayout() {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    return (
        <SidebarProvider>
            <AppSidebar selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
            <SidebarInset>
                {/* Top bar */}
                <header className="flex h-14 items-center gap-2 border-b px-4 sticky top-0 z-10 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm font-medium text-muted-foreground">Task Manager</span>
                    <div className="ml-auto flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    <Outlet context={{ selectedStatus, setSelectedStatus }} />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
