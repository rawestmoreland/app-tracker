import { validateFile } from '../file-validation';
import { R2Service } from '../r2';

export class LogoUploadService {
  static async uploadLogo(
    logo: string,
    bucketName: string,
    companyName: string,
  ): Promise<{
    success: boolean;
    filename: string | null;
    error: string | null;
  }> {
    const filename = `${companyName.toLowerCase().replace(/ /g, '_')}_logo.jpeg`;
    const response = await fetch(logo);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const validationResult = await validateFile(buffer, filename, {
      maxSize: 10 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    });
    if (validationResult.isValid) {
      try {
        await R2Service.uploadFile(
          filename,
          buffer,
          validationResult.detectedMimeType!,
          bucketName,
        );
        return {
          success: true,
          filename,
          error: null,
        };
      } catch (error) {
        return {
          success: false,
          error: 'Failed to upload logo',
          filename: null,
        };
      }
    }
    return {
      success: false,
      error: 'Failed file validation',
      filename: null,
    };
  }
}
