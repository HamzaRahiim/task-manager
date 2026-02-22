import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "@/lib/utils";

interface Status {
    name: string;
    color: string;
}

interface Priority {
    name: string;
    color: string;
}

interface TaskFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedStatus: string | null;
    onStatusChange: (status: string | null) => void;
    selectedPriority: string | null;
    onPriorityChange: (priority: string | null) => void;
    statuses: Status[];
    priorities: Priority[];
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function TaskFilters({
    search,
    onSearchChange,
    selectedStatus,
    onStatusChange,
    selectedPriority,
    onPriorityChange,
    statuses,
    priorities,
    hasActiveFilters,
    onClearFilters,
}: TaskFiltersProps) {
    const [localSearch, setLocalSearch] = useState(search);

    const debouncedSearch = useCallback(
        debounce((value: unknown) => {
            onSearchChange(value as string);
        }, 300),
        [onSearchChange],
    );

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.target.value;
        setLocalSearch(value);
        debouncedSearch(value);
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    className="pl-10 pr-8"
                    value={localSearch}
                    onChange={handleSearchInput}
                />
                {localSearch ? (
                    <button
                        onClick={() => handleSearchInput({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : null}
            </div>

            {/* Status & Priority Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus ? selectedStatus : "__all__"} onValueChange={(value) => onStatusChange(value === "__all__" ? null : value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">All Statuses</SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status.name} value={status.name}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: status.color }}
                                        />
                                        {status.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={selectedPriority ? selectedPriority : "__all__"} onValueChange={(value) => onPriorityChange(value === "__all__" ? null : value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="__all__">All Priorities</SelectItem>
                            {priorities.map((priority) => (
                                <SelectItem key={priority.name} value={priority.name}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: priority.color }}
                                        />
                                        {priority.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters ? (
                <div className="flex justify-end pt-2">
                    <Button size="sm" variant="link" onClick={onClearFilters}>
                        Clear Filters
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
