import { LinkedInCompanyData, ScrapingResult, ScrapingOptions } from './types.js';
export declare class LinkedInCompanyScraper {
    private readonly defaultOptions;
    private rateLimiter;
    scrapeCompany(linkedinUrl: string, options?: Partial<ScrapingOptions>): Promise<ScrapingResult<LinkedInCompanyData>>;
    scrapeCompanyByName(companyName: string, options?: Partial<ScrapingOptions>): Promise<ScrapingResult<LinkedInCompanyData>>;
    private buildLinkedInUrl;
    private validateLinkedInUrl;
    private respectRateLimit;
    private fetchCompanyPage;
    private hasLoginPrompt;
    private parseCompanyData;
    private extractCompanyName;
    private extractDescription;
    private extractWebsite;
    private extractWebsiteFromDataTable;
    private extractRedirectUrl;
    private extractIndustry;
    private extractCompanySize;
    private extractHeadquarters;
    private extractFoundedYear;
    private extractSpecialties;
    private extractInfoByLabel;
    private extractLogo;
    private extractFollowers;
}
export declare const linkedinScraper: LinkedInCompanyScraper;
//# sourceMappingURL=linkedin-scraper.d.ts.map