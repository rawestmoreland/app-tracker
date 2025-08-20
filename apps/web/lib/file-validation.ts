import { fileTypeFromBuffer } from 'file-type';
import path from 'path';
import { randomUUID } from 'node:crypto';

// Allowed file types for resume uploads
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
] as const;

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  detectedMimeType?: string;
  detectedExtension?: string;
}

export interface FileValidationOptions {
  maxSize?: number;
  allowedMimeTypes?: readonly string[];
  allowedExtensions?: readonly string[];
}

/**
 * Comprehensive file validation for uploaded files
 */
export async function validateFile(
  buffer: Buffer,
  originalFilename: string,
  options: FileValidationOptions = {}
): Promise<FileValidationResult> {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedMimeTypes = ALLOWED_MIME_TYPES,
    allowedExtensions = ALLOWED_EXTENSIONS,
  } = options;

  // 1. Check file size
  if (buffer.length > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds limit of ${Math.round(
        maxSize / 1024 / 1024
      )}MB`,
    };
  }

  // 2. Check if file is empty
  if (buffer.length === 0) {
    return {
      isValid: false,
      error: 'File is empty',
    };
  }

  // 3. Validate file extension
  const fileExtension = path.extname(originalFilename).toLowerCase();
  if (
    !allowedExtensions.includes(
      fileExtension as (typeof allowedExtensions)[number]
    )
  ) {
    return {
      isValid: false,
      error: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(
        ', '
      )}`,
    };
  }

  // 4. Detect actual file type using magic numbers
  let detectedFileType;
  try {
    detectedFileType = await fileTypeFromBuffer(buffer);
  } catch {
    return {
      isValid: false,
      error: 'Failed to detect file type',
    };
  }

  // 5. Check if file type could be detected
  if (!detectedFileType) {
    return {
      isValid: false,
      error: 'Unable to determine file type',
    };
  }

  // 6. Validate detected MIME type
  if (!allowedMimeTypes.includes(detectedFileType.mime)) {
    return {
      isValid: false,
      error: `File type not allowed. Detected: ${
        detectedFileType.mime
      }. Allowed: ${allowedMimeTypes.join(', ')}`,
      detectedMimeType: detectedFileType.mime,
    };
  }

  // 7. Cross-check extension with detected type
  const extensionMimeMap: Record<string, string[]> = {
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword'],
    '.docx': [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  };

  const expectedMimeTypes = extensionMimeMap[fileExtension];
  if (expectedMimeTypes && !expectedMimeTypes.includes(detectedFileType.mime)) {
    return {
      isValid: false,
      error: `File extension '${fileExtension}' does not match detected file type '${detectedFileType.mime}'`,
      detectedMimeType: detectedFileType.mime,
      detectedExtension: `.${detectedFileType.ext}`,
    };
  }

  return {
    isValid: true,
    detectedMimeType: detectedFileType.mime,
    detectedExtension: `.${detectedFileType.ext}`,
  };
}

/**
 * Sanitize filename to prevent path traversal and other issues
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path separators and dangerous characters
  const sanitized = filename
    .replace(/[/\\:*?"<>|]/g, '') // Remove dangerous characters
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/^\.+/, '') // Remove leading dots
    .trim();

  // Ensure filename isn't empty after sanitization
  if (!sanitized) {
    return 'untitled';
  }

  // Limit filename length
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = path.extname(sanitized);
    const baseName = path.basename(sanitized, ext);
    return baseName.substring(0, maxLength - ext.length) + ext;
  }

  return sanitized;
}

/**
 * Generate a secure filename using UUID while preserving extension
 */
export function generateSecureFilename(originalFilename: string): string {
  const extension = path.extname(originalFilename);
  const uuid = randomUUID();
  return `${uuid}${extension}`;
}
