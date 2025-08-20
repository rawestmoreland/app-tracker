'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload, X, File, Download } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: () => void;
  onUploadError: (error: string) => void;
  onDelete: () => void;
  existingFile?: { key: string; filename: string };
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  applicationId: string;
  stackButtons?: boolean;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  onDelete,
  existingFile,
  accept = '.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = '',
  applicationId,
  stackButtons = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize) {
      onUploadError(
        `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      );
      return;
    }

    setIsUploading(true);
    try {
      // Upload file through API using FormData
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `/api/applications/${applicationId}/resume`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const result = await response.json();

      if (result.success) {
        onUploadComplete();
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDownload = async () => {
    if (!existingFile) return;

    try {
      const response = await fetch(`/api/applications/${applicationId}/resume`);
      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const { downloadUrl } = await response.json();

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = existingFile.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      onUploadError('Failed to download file');
    }
  };

  if (existingFile) {
    return (
      <div
        className={`flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50 ${className}`}
      >
        <div className='flex items-center space-x-3 min-w-0 w-full'>
          <File className='h-5 w-5 text-gray-500 flex-shrink-0' />
          <div className='flex flex-col min-w-0 w-full'>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {existingFile.filename}
            </p>
            <p className='text-xs text-gray-500'>Resume uploaded</p>
          </div>
        </div>
        <div
          className={`flex ${
            stackButtons ? 'flex-col gap-2 w-full' : 'flex-row space-x-2'
          }`}
        >
          <Button
            variant='outline'
            size='sm'
            onClick={handleDownload}
            className='flex items-center space-x-1 w-full'
          >
            <Download className='h-4 w-4' />
            <span>Download</span>
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={onDelete}
            className='flex items-center space-x-1 text-red-600 hover:text-red-700 w-full'
          >
            <X className='h-4 w-4' />
            <span>Remove</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        onChange={handleFileInputChange}
        className='hidden'
        disabled={isUploading}
      />

      <div className='space-y-4 flex flex-col items-center'>
        <Upload className='mx-auto h-12 w-12 text-gray-400' />

        <div>
          <p className='text-sm font-medium text-gray-900'>
            {isUploading ? 'Uploading...' : 'Upload your resume'}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            PDF, DOC, or DOCX up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className='flex items-center space-x-2'
        >
          <Upload className='h-4 w-4' />
          <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
        </Button>

        <p className='text-xs text-gray-500'>or drag and drop your file here</p>
      </div>
    </div>
  );
}
