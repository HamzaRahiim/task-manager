import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks/useTasks";
import { tasksApi } from "@/api/tasks.api";

interface Status {
    name: string;
    color?: string;
}

interface TaskStatsProps {
    statuses: Status[];
    onStatusClick: (statusName: string) => void;
}

interface TasksResponse {
    pagination?: {
        total?: number;
    };
}

export default function TaskStats({ statuses, onStatusClick }: TaskStatsProps) {
    const { data: tasksData, isLoading: totalLoading } = useTasks({ limit: 1 });
    const total = (tasksData as TasksResponse)?.pagination?.total ?? 0;

    // Fetch count for each status in parallel
    const statusQueries = useQueries({
        queries: statuses.map((status) => ({
            queryKey: ["tasks", { status: status.name, limit: 1 }],
            queryFn: () => tasksApi.getAll({ status: status.name, limit: 1 }),
            staleTime: 30_000,
        })),
    });

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        statusQueries.forEach((query, index) => {
            const data = query.data as TasksResponse;
            if (data?.pagination?.total !== undefined) {
                const statusName = statuses[index]?.name;
                if (statusName) {
                    counts[statusName] = data.pagination.total;
                }
            }
        });
        return counts;
    }, [statusQueries, statuses]);

    const stats = [
        { title: "Total", value: total, status: null, color: undefined },
        ...statuses.map((status) => ({
            title: status.name,
            status: status.name,
            value: statusCounts[status.name] ?? 0,
            color: status.color,
        })),
    ];

    const isLoading = totalLoading || statusQueries.some((q) => q.isLoading);

    if (isLoading) {
        return (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[100px]" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <button
                    key={i}
                    onClick={() => stat.status && onStatusClick(stat.status)}
                    className="text-left transition hover:opacity-80"
                    disabled={!stat.status}
                >
                    <Card className="cursor-pointer hover:shadow-md">
                        <CardHeader
                            className={`pb-2 ${stat.color ? "border-t-4" : ""}`}
                            style={stat.color ? { borderTopColor: stat.color } : {}}
                        >
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-2xl font-bold">{stat.value}</span>
                        </CardContent>
                    </Card>
                </button>
            ))}
        </div>
    );
}
