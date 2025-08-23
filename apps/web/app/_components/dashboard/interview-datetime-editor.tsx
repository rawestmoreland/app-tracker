'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateInterviewScheduledAt } from '@/lib/actions/interview-actions';
import { toast } from 'sonner';

interface InterviewDateTimeEditorProps {
  interviewId: string;
  currentDateTime: Date | null;
}

export function InterviewDateTimeEditor({
  interviewId,
  currentDateTime,
}: InterviewDateTimeEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentDateTime || undefined,
  );
  const [timeValue, setTimeValue] = useState(
    currentDateTime ? format(currentDateTime, 'HH:mm') : '09:00',
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let finalDateTime: Date | null = null;

      if (selectedDate) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        finalDateTime = new Date(selectedDate);
        finalDateTime.setHours(hours, minutes, 0, 0);
      }

      const result = await updateInterviewScheduledAt(
        interviewId,
        finalDateTime,
      );

      if (result.success) {
        toast.success('Interview date/time updated successfully');
        setIsOpen(false);
      } else {
        toast.error(result.error || 'Failed to update date/time');
      }
    } catch (error) {
      toast.error('Failed to update date/time');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    try {
      const result = await updateInterviewScheduledAt(interviewId, null);

      if (result.success) {
        toast.success('Interview date/time cleared');
        setSelectedDate(undefined);
        setTimeValue('09:00');
        setIsOpen(false);
      } else {
        toast.error(result.error || 'Failed to clear date/time');
      }
    } catch (error) {
      toast.error('Failed to clear date/time');
    } finally {
      setIsLoading(false);
    }
  };

  const displayText = currentDateTime
    ? new Date(currentDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Set date & time';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full cursor-pointer justify-start p-0 text-left text-sm font-normal text-gray-900 hover:text-gray-700 hover:underline"
        >
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-3 p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            autoFocus
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Time</label>
            <Input
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading || !selectedDate}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
