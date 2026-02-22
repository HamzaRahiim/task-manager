import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PRESET_COLORS = [
    "#6B7280",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
];

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    disabled?: boolean;
}

export default function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((hex) => (
                    <button
                        key={hex}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(hex)}
                        className={cn(
                            "h-7 w-7 rounded-full border-2 transition",
                            value?.toLowerCase() === hex.toLowerCase()
                                ? "border-foreground"
                                : "border-transparent",
                            disabled && "opacity-60",
                        )}
                        style={{ backgroundColor: hex }}
                        aria-label={`Select color ${hex}`}
                    />
                ))}
            </div>
            <Input
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                placeholder="#6B7280"
                maxLength={7}
            />
        </div>
    );
}
