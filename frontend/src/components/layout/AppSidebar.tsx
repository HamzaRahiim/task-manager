import { useState } from "react";
import { MoreVertical } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatuses } from "@/hooks/useStatuses";
import { usePriorities } from "@/hooks/usePriorities";
import StatusManager from "@/components/statuses/StatusManager";
import PriorityManager from "@/components/priorities/PriorityManager";

interface AppSidebarProps {
    selectedStatus: string | null;
    onStatusChange: (status: string | null) => void;
}

export default function AppSidebar({ selectedStatus, onStatusChange }: AppSidebarProps) {
    const { data: statuses = [], isLoading: statusesLoading } = useStatuses();
    const { data: priorities = [], isLoading: prioritiesLoading } = usePriorities();

    const [statusManagerOpen, setStatusManagerOpen] = useState(false);
    const [priorityManagerOpen, setPriorityManagerOpen] = useState(false);



    return (
        <>
            <Sidebar>
                <SidebarHeader className="border-b">
                    <div className="text-lg font-bold">📋 TaskFlow</div>
                </SidebarHeader>

                <SidebarContent>
                    {/* Navigation */}
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={!selectedStatus}
                                    onClick={() => onStatusChange(null)}
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <span>All Tasks</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>

                    {/* Statuses */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Statuses</SidebarGroupLabel>
                        <SidebarGroupAction asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setStatusManagerOpen(true)}
                                title="Manage statuses"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                            {statusesLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : statuses.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No statuses</p>
                            ) : (
                                <SidebarMenu>
                                    {statuses.map((status) => (
                                        <SidebarMenuItem key={status.name}>
                                            <SidebarMenuButton
                                                isActive={selectedStatus === status.name}
                                                onClick={() => onStatusChange(status.name)}
                                                className="cursor-pointer"
                                            >
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: status.color }}
                                                />
                                                <span className="flex-1">{status.name}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Priorities */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Priorities</SidebarGroupLabel>
                        <SidebarGroupAction asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPriorityManagerOpen(true)}
                                title="Manage priorities"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                            {prioritiesLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : priorities.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No priorities</p>
                            ) : (
                                <SidebarMenu>
                                    {priorities.map((priority) => (
                                        <SidebarMenuItem key={priority.name}>
                                            <SidebarMenuButton className="cursor-default" asChild>
                                                <span>
                                                    <span
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: priority.color }}
                                                    />
                                                    <span className="flex-1">{priority.name}</span>
                                                </span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <p className="text-xs text-center text-muted-foreground">Built with ❤️</p>
                </SidebarFooter>
            </Sidebar>

            <StatusManager open={statusManagerOpen} onClose={() => setStatusManagerOpen(false)} counts={{}} />
            <PriorityManager open={priorityManagerOpen} onClose={() => setPriorityManagerOpen(false)} counts={{}} />
        </>
    );
}
