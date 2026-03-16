import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"

export function Confirmation({ title, description, buttonLabel, open, setOpen }: { title: string, description: string, buttonLabel: string, open: boolean, setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild >
                    <Button variant="outline" > Open Dialog </Button>
                </DialogTrigger>
                < DialogContent className="sm:max-w-sm" >
                    <DialogHeader>
                        <DialogTitle>{title} </DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    < DialogFooter >
                        <DialogClose asChild >
                            <Button variant="outline" > Cancel </Button>
                        </DialogClose>
                        < Button type="submit" >{buttonLabel} </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
