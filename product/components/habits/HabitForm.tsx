// components/habits/HabitForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// HABIT FORM — Create or edit a habit
// Used in a modal/sheet. Controlled via React Hook Form + Zod validation.
// ─────────────────────────────────────────────────────────────────────────────

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { HABIT_COLORS, HABIT_ICONS, cn } from "@/lib/utils"
import type { Habit, CreateHabitInput } from "@/types"

const habitSchema = z.object({
  name: z.string().min(1, "Name is required").max(60, "Max 60 characters"),
  icon: z.string(),
  color: z.string(),
  frequency: z.enum(["DAILY", "WEEKLY"]),
  targetDays: z.number().min(1).max(7),
})

interface HabitFormProps {
  initialValues?: Partial<Habit>
  onSubmit: (data: CreateHabitInput) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function HabitForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Create Habit",
}: HabitFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateHabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      icon: initialValues?.icon ?? "⚡",
      color: initialValues?.color ?? "#6366f1",
      frequency: initialValues?.frequency ?? "DAILY",
      targetDays: initialValues?.targetDays ?? 7,
    },
  })

  const selectedIcon = watch("icon")
  const selectedColor = watch("color")
  const frequency = watch("frequency")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* Preview */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-theme">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: selectedColor + "20" }}
        >
          {selectedIcon}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-fore break-words text-lg leading-tight">
            {watch("name") || "Habit name"}
          </p>
          <p className="text-xs text-fore-2 mt-0.5 capitalize">
            {frequency.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Name */}
      <Input
        label="Habit Name"
        placeholder="e.g. Morning Meditation"
        error={errors.name?.message}
        {...register("name")}
        maxLength={60}
      />

      {/* Icon picker */}
      <div>
        <p className="text-sm font-medium text-fore-2 mb-2">Icon</p>
        <div className="grid grid-cols-8 gap-1.5">
          {HABIT_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue("icon", icon)}
              className={cn(
                "h-10 w-full rounded-xl text-xl flex items-center justify-center",
                "transition-all duration-150",
                "hover:bg-surface-2 hover:scale-110",
                selectedIcon === icon
                  ? "ring-2 ring-offset-1 scale-110"
                  : "bg-surface border border-theme"
              )}
              style={selectedIcon === icon ? { "--tw-ring-color": selectedColor } as any : {}}            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <p className="text-sm font-medium text-fore-2 mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue("color", color)}
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-150",
                "hover:scale-110",
                selectedColor === color
                  ? "ring-2 ring-offset-2 scale-110"
                  : ""
              )}
              style={{
                background: color,
                ...(selectedColor === color
                  ? { "--tw-ring-color": color } as any
                  : {}),
              }}
            />
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <p className="text-sm font-medium text-fore-2 mb-2">Frequency</p>
        <div className="flex gap-2">
          {(["DAILY", "WEEKLY"] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setValue("frequency", freq)}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-medium transition-all",
                frequency === freq
                  ? "text-white shadow-sm"
                  : "bg-surface border border-theme text-fore-2 hover:bg-surface-2"
              )}
              style={
                frequency === freq ? { background: selectedColor } : {}
              }
            >
              {freq === "DAILY" ? "Every day" : "Weekly"}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
