'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { updateInterviewDuration } from '@/lib/actions/interview-actions';
import { toast } from 'sonner';

interface InterviewDurationEditorProps {
  interviewId: string;
  currentDuration: number | null;
}

export function InterviewDurationEditor({
  interviewId,
  currentDuration,
}: InterviewDurationEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentDuration?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const duration = value.trim() === '' ? null : parseInt(value.trim());

      if (duration !== null && (isNaN(duration) || duration <= 0)) {
        toast.error('Duration must be a positive number');
        setIsLoading(false);
        return;
      }

      const result = await updateInterviewDuration(interviewId, duration);

      if (result.success) {
        toast.success('Duration updated successfully');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to update duration');
        setValue(currentDuration?.toString() || '');
      }
    } catch (error) {
      toast.error('Failed to update duration');
      setValue(currentDuration?.toString() || '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(currentDuration?.toString() || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="w-20 text-sm"
          placeholder="60"
          disabled={isLoading}
          min="1"
          autoFocus
        />
        <span className="text-sm text-gray-900">minutes</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="cursor-pointer text-left text-sm text-gray-900 hover:text-gray-700 hover:underline"
    >
      {currentDuration ? `${currentDuration} minutes` : 'Set duration'}
    </button>
  );
}
