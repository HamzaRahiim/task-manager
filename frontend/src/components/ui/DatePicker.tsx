import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function DatePicker({
    value,
    onChange,
    disabled,
    placeholder = "Pick a date",
}: DatePickerProps) {
    const date = value ? new Date(value) : undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                        onChange(selectedDate ? selectedDate.toISOString().split("T")[0] : "");
                    }}
                    disabled={{ before: new Date() }}
                />
            </PopoverContent>
        </Popover>
    );
}
