"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusColor } from "@/lib/utils";
import { toast } from "sonner";

export interface StatusOption<T = string> {
  value: T;
  label: string;
}

interface StatusDropdownProps<T = string> {
  itemId: string;
  currentStatus: T;
  statusOptions: StatusOption<T>[];
  onStatusUpdate: (itemId: string, newStatus: T) => Promise<{ error?: string }>;
  getStatusColor?: (status: T) => string;
  disabled?: boolean;
}

export function StatusDropdown<T = string>({
  itemId,
  currentStatus,
  statusOptions,
  onStatusUpdate,
  getStatusColor: getStatusColorProp,
  disabled = false,
}: StatusDropdownProps<T>) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleStatusChange = (newStatus: T) => {
    setOptimisticStatus(newStatus);

    startTransition(async () => {
      const result = await onStatusUpdate(itemId, newStatus);

      if (result.error) {
        // Don't show toast for 'cancelled' error (used for dialog flows)
        if (result.error !== 'cancelled') {
          toast(result.error);
        }
        setOptimisticStatus(currentStatus);
      } else {
        toast("Status updated successfully");
      }
    });
  };

  const currentLabel =
    statusOptions.find((option) => option.value === optimisticStatus)?.label ||
    String(optimisticStatus);

  const statusColorFn = getStatusColorProp || ((status: T) => getStatusColor(status as any));

  return (
    <Select
      value={String(optimisticStatus)}
      onValueChange={(value) => handleStatusChange(value as T)}
      disabled={isPending || disabled}
    >
      <SelectTrigger className="h-auto w-fit border-none bg-transparent p-0 shadow-none">
        <SelectValue asChild>
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColorFn(
              optimisticStatus,
            )} ${isPending ? "opacity-50" : ""}`}
          >
            {currentLabel.replace(/_/g, " ")}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColorFn(
                option.value,
              )}`}
            >
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
