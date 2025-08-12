export interface LinkedInCompanyData {
  name: string;
  description?: string;
  website?: string;
  companyUrl?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  founded?: number;
  specialties?: string[];
  logo?: string;
  linkedinUrl: string;
  followers?: number;
}

export interface ScrapingResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ScrapingOptions {
  timeout?: number;
  retries?: number;
  delay?: number;
  userAgent?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export class ScrapingError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ScrapingError';
  }
}