import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface OptionItem {
    name: string;
    color: string;
}

interface ComboboxCreatableProps {
    value: string | null;
    onChange: (value: string) => void;
    options: OptionItem[];
    onCreateNew: (name: string) => void;
    placeholder: string;
    disabled?: boolean;
}

export default function ComboboxCreatable({
    value,
    onChange,
    options,
    onCreateNew,
    placeholder,
    disabled,
}: ComboboxCreatableProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query) return options;
        const q = query.toLowerCase();
        return options.filter((option) => option.name.toLowerCase().includes(q));
    }, [options, query]);

    const exactExists = options.some(
        (option) => option.name.toLowerCase() === query.trim().toLowerCase(),
    );
    const canCreate = query.trim().length > 0 && !exactExists;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className="w-full justify-between"
                >
                    <span className="truncate">{value || placeholder}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
            >
                <Command>
                    <CommandInput
                        value={query}
                        onValueChange={setQuery}
                        placeholder={`Search ${placeholder}`}
                    />
                    <CommandList>
                        <CommandEmpty>No matches found.</CommandEmpty>
                        {canCreate ? (
                            <CommandGroup>
                                <CommandItem
                                    value={`create-${query}`}
                                    onSelect={() => {
                                        onCreateNew(query.trim());
                                        setOpen(false);
                                        setQuery("");
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                    Create "{query.trim()}"
                                </CommandItem>
                            </CommandGroup>
                        ) : null}
                        <CommandGroup>
                            {filtered.map((option) => (
                                <CommandItem
                                    key={option.name}
                                    value={option.name}
                                    onSelect={() => {
                                        onChange(option.name);
                                        setOpen(false);
                                        setQuery("");
                                    }}
                                >
                                    <span
                                        className="inline-flex h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: option.color }}
                                    />
                                    {option.name}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            option.name === value ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
