import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    onConfirm: () => void;
    isPending: boolean;
}

export default function TaskDeleteDialog({
    open,
    onClose,
    title,
    onConfirm,
    isPending,
}: TaskDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={(state) => !state && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Task "{title}" will be permanently
                        deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Delete Task
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
