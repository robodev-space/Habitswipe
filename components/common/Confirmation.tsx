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

export function Confirmation() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild >
                    <Button variant="outline" > Open Dialog </Button>
                </DialogTrigger>
                < DialogContent className="sm:max-w-sm" >
                    <DialogHeader>
                        <DialogTitle>Edit profile </DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    < FieldGroup >
                        <Field>
                            <Label htmlFor="name-1" > Name </Label>
                            < Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </Field>
                        < Field >
                            <Label htmlFor="username-1" > Username </Label>
                            < Input id="username-1" name="username" defaultValue="@peduarte" />
                        </Field>
                    </FieldGroup>
                    < DialogFooter >
                        <DialogClose asChild >
                            <Button variant="outline" > Cancel </Button>
                        </DialogClose>
                        < Button type="submit" > Save changes </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
