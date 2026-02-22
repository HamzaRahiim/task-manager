import { Badge } from "@/components/ui/badge";
import { getBadgeStyle } from "@/lib/utils";

interface PriorityBadgeProps {
    name: string;
    color?: string;
}

export default function PriorityBadge({ name, color = "#6B7280" }: PriorityBadgeProps) {
    return (
        <Badge variant="outline" style={getBadgeStyle(color)}>
            {name || "Unknown"}
        </Badge>
    );
}
