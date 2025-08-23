'use client';

import { useState } from 'react';
import { Resume } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { updateApplicationResume } from '@/lib/actions/application-actions';
import { FileUpload } from '@/components/file-upload';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ResumeSelectorProps {
  applicationId: string;
  resumes: Resume[];
  currentResumeId?: string | null;
  onResumeChange?: (resumeId: string | null) => void;
}

export default function ResumeSelector({
  applicationId,
  resumes,
  currentResumeId,
  onResumeChange,
}: ResumeSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isViewingResume, setIsViewingResume] = useState(false);

  const handleResumeChange = async (value: string) => {
    if (value === 'upload-new') {
      setShowUpload(true);
      return;
    }
    setShowUpload(false);
    const resumeId = value === 'none' ? null : value;
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateApplicationResume(applicationId, resumeId);

      if (result.success) {
        onResumeChange?.(resumeId);
      } else {
        setError(result.error || 'Failed to update resume');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResumeUploadComplete = () => {
    // Refresh the page to show the newly uploaded resume
    window.location.reload();
  };

  const handleResumeUploadError = (error: string) => {
    setError(error);
  };

  const handleResumeDelete = async () => {
    // This will be handled by the FileUpload component
    // We just need to refresh the page after deletion
    window.location.reload();
  };

  const handleResumeView = async (resumeId: string) => {
    setIsViewingResume(true);
    setError(null);

    try {
      const response = await fetch(`/api/resumes/${resumeId}`);

      if (!response.ok) {
        throw new Error('Failed to get resume download URL');
      }

      const { downloadUrl, filename } = await response.json();

      // Open the resume in a new tab
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error viewing resume:', error);
      setError('Failed to open resume');
    } finally {
      setIsViewingResume(false);
    }
  };

  const currentResume = resumes.find((r) => r.id === currentResumeId);

  if (resumes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onUploadComplete={handleResumeUploadComplete}
            onUploadError={handleResumeUploadError}
            onDelete={handleResumeDelete}
            applicationId={applicationId}
            accept=".pdf,.doc,.docx"
            maxSize={10 * 1024 * 1024} // 10MB
            stackButtons
            className="flex-col gap-2"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Resume
          </label>
          <Select
            value={currentResumeId || 'none'}
            onValueChange={handleResumeChange}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a resume for this application..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No resume submitted</SelectItem>
              {resumes.map((resume) => (
                <SelectItem key={resume.id} value={resume.id}>
                  {resume.name}
                </SelectItem>
              ))}
              <SelectItem value="upload-new">+ Upload New Resume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {showUpload && (
          <div className="mt-4">
            <FileUpload
              onUploadComplete={handleResumeUploadComplete}
              onUploadError={handleResumeUploadError}
              onDelete={handleResumeDelete}
              applicationId={applicationId}
              accept=".pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024} // 10MB
              stackButtons
              className="flex-col gap-2"
            />
          </div>
        )}

        {currentResume && (
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h4 className="truncate font-medium text-gray-900">
                          {currentResume.name}
                        </h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currentResume.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <span className="truncate">
                      {format(new Date(currentResume.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResumeView(currentResume.id)}
                  disabled={isViewingResume}
                  className="flex w-full gap-1"
                >
                  <Download className="h-3 w-3" />
                  {isViewingResume ? 'Opening...' : 'View'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {isUpdating && (
          <p className="text-sm text-gray-500">Updating resume...</p>
        )}
      </CardContent>
    </Card>
  );
}
