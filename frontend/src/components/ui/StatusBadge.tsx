import { Badge } from "@/components/ui/badge";
import { getBadgeStyle } from "@/lib/utils";

interface StatusBadgeProps {
    name: string;
    color?: string;
}

export default function StatusBadge({ name, color = "#6B7280" }: StatusBadgeProps) {
    return (
        <Badge variant="outline" style={getBadgeStyle(color)}>
            {name || "Unknown"}
        </Badge>
    );
}
