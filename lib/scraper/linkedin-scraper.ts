import * as cheerio from 'cheerio';
import {
  LinkedInCompanyData,
  ScrapingResult,
  ScrapingOptions,
  ScrapingError,
} from './types.js';

export class LinkedInCompanyScraper {
  private readonly defaultOptions: Required<Omit<ScrapingOptions, 'credentials'>> = {
    timeout: 30000,
    retries: 3,
    delay: 1000,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  private rateLimiter = {
    lastRequest: 0,
    minDelay: 2000,
  };

  async scrapeCompany(
    linkedinUrl: string,
    options: Partial<ScrapingOptions> = {}
  ): Promise<ScrapingResult<LinkedInCompanyData>> {
    const opts = { ...this.defaultOptions, ...options };

    try {
      this.validateLinkedInUrl(linkedinUrl);
      await this.respectRateLimit();

      const html = await this.fetchCompanyPage(linkedinUrl, opts);
      const companyData = this.parseCompanyData(html, linkedinUrl);

      return {
        success: true,
        data: companyData,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date(),
      };
    }
  }

  async scrapeCompanyByName(
    companyName: string,
    options: Partial<ScrapingOptions> = {}
  ): Promise<ScrapingResult<LinkedInCompanyData>> {
    const linkedinUrl = this.buildLinkedInUrl(companyName);
    return this.scrapeCompany(linkedinUrl, options);
  }

  private buildLinkedInUrl(companyName: string): string {
    // Convert company name to LinkedIn URL format
    const normalizedName = companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    return `https://www.linkedin.com/company/${normalizedName}/`;
  }

  private validateLinkedInUrl(url: string): void {
    const linkedinCompanyRegex =
      /^https:\/\/(www\.)?linkedin\.com\/company\/[^\/]+\/?$/;
    if (!linkedinCompanyRegex.test(url)) {
      throw new ScrapingError(
        'Invalid LinkedIn company URL format. Expected: https://linkedin.com/company/company-name',
        'INVALID_URL'
      );
    }
  }

  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.rateLimiter.lastRequest;

    if (timeSinceLastRequest < this.rateLimiter.minDelay) {
      const delay = this.rateLimiter.minDelay - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.rateLimiter.lastRequest = Date.now();
  }

  private async fetchCompanyPage(
    url: string,
    options: Required<Omit<ScrapingOptions, 'credentials'>>
  ): Promise<string> {
    let lastError: Error;

    for (let attempt = 1; attempt <= options.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout);

        const response = await fetch(url, {
          headers: {
            'User-Agent': options.userAgent,
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ScrapingError(
            `HTTP ${response.status}: ${response.statusText}`,
            'HTTP_ERROR'
          );
        }

        const html = await response.text();
        
        // Check if we got a login prompt and try to dismiss it
        if (this.hasLoginPrompt(html)) {
          // We can still extract basic company info from the page even with login prompt
          console.warn('LinkedIn login prompt detected, but attempting to extract available data');
        }

        return html;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error('Unknown fetch error');

        if (attempt < options.retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, options.delay * attempt)
          );
        }
      }
    }

    throw new ScrapingError(
      `Failed to fetch page after ${options.retries} attempts: ${
        lastError!.message
      }`,
      'FETCH_FAILED'
    );
  }

  private hasLoginPrompt(html: string): boolean {
    const $ = cheerio.load(html);
    
    // Check for login prompt/overlay (not full login page)
    const hasAuthPrompt = $('.authwall, .auth-wall, [data-test="auth-wall"]').length > 0;
    const hasJoinPrompt = $(':contains("Join now"), :contains("Sign up")').length > 0;
    const hasSignInPrompt = $(':contains("Sign in to see more")').length > 0;
    
    return hasAuthPrompt || hasJoinPrompt || hasSignInPrompt;
  }


  private parseCompanyData(
    html: string,
    linkedinUrl: string
  ): LinkedInCompanyData {
    const $ = cheerio.load(html);
    const companyData: LinkedInCompanyData = {
      name: '',
      linkedinUrl,
    };

    try {
      companyData.name = this.extractCompanyName($);
      companyData.description = this.extractDescription($);
      const websiteUrl = this.extractWebsite($);
      companyData.website = websiteUrl;
      companyData.companyUrl = websiteUrl;
      companyData.industry = this.extractIndustry($);
      companyData.companySize = this.extractCompanySize($);
      companyData.headquarters = this.extractHeadquarters($);
      companyData.founded = this.extractFoundedYear($);
      companyData.specialties = this.extractSpecialties($);
      companyData.logo = this.extractLogo($);
      companyData.followers = this.extractFollowers($);
    } catch (error) {
      throw new ScrapingError(
        `Failed to parse company data: ${
          error instanceof Error ? error.message : 'Unknown parsing error'
        }`,
        'PARSE_ERROR'
      );
    }

    if (!companyData.name) {
      throw new ScrapingError(
        'Could not extract company name - page might be protected or structure changed',
        'NO_COMPANY_NAME'
      );
    }

    return companyData;
  }

  private extractCompanyName($: cheerio.CheerioAPI): string {
    // Company page selectors for company name
    const selectors = [
      'h1.top-card-layout__title',
      'h1.org-top-card-summary__title', 
      'h1.t-24',
      '.top-card-layout__entity-info h1',
      '.org-top-card-primary-content__title h1',
      '.org-top-card-summary-info__title',
      'h1[data-test="company-name"]',
      'title',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        let text = element.text().trim();

        // Clean up title tag text
        if (selector === 'title') {
          text = text.replace(/\s*\|\s*LinkedIn.*$/i, '').trim();
          text = text.replace(/Company\s*\|\s*/i, '').trim();
        }

        if (text) {
          return text;
        }
      }
    }

    return '';
  }

  private extractDescription($: cheerio.CheerioAPI): string | undefined {
    // Company page selectors for description
    const selectors = [
      '.org-top-card-summary-info-list__info-item .break-words',
      '.org-top-card-summary-info__summary',
      '.org-top-card-summary__description',
      '.break-words p',
      '.top-card-layout__summary .break-words',
      '.org-about-us-organization-description__text',
      '[data-test="company-description"]',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        if (text && text !== 'See more') {
          return text;
        }
      }
    }

    return undefined;
  }

  private extractWebsite($: cheerio.CheerioAPI): string | undefined {
    // First, try using the same data table approach as industry and company size
    const websiteFromDataTable = this.extractWebsiteFromDataTable($);
    if (websiteFromDataTable) {
      return websiteFromDataTable;
    }

    // Company page selectors for website - enhanced with more selectors
    const selectors = [
      '.org-top-card-primary-actions a[href*="http"]',
      '.org-top-card-summary-info-list__info-item a[href*="http"]',
      '.top-card-layout__cta a[href*="http"]',
      'dd a[href*="http"]',
      'a[data-test="company-website"]',
      'a[href*="/redir/"]',
      '.org-top-card-primary-content__cta-container a[href*="http"]',
      '.org-about-company-module a[href*="http"]',
      '.org-top-card-primary-content__actions a[href*="http"]',
      'a[data-control-name="contact_see_more_expand"]',
      '.link-without-visited-state[href*="http"]',
      '.org-page-details__definition-text a[href*="http"]',
    ];

    // Second, try to find website URL in structured data or meta tags
    const jsonLdScripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < jsonLdScripts.length; i++) {
      try {
        const jsonData = JSON.parse($(jsonLdScripts[i]).html() || '');
        if (jsonData.url && !jsonData.url.includes('linkedin.com')) {
          return jsonData.url;
        }
        if (jsonData.sameAs) {
          const sameAs = Array.isArray(jsonData.sameAs) ? jsonData.sameAs : [jsonData.sameAs];
          for (const url of sameAs) {
            if (typeof url === 'string' && !url.includes('linkedin.com') && url.startsWith('http')) {
              return url;
            }
          }
        }
      } catch {
        // Ignore JSON parsing errors
      }
    }

    // Then try the CSS selectors
    for (const selector of selectors) {
      const elements = $(selector);
      for (let i = 0; i < elements.length; i++) {
        const element = $(elements[i]);
        const href = element.attr('href');
        const text = element.text().trim().toLowerCase();
        
        if (href && (href.startsWith('http') || href.startsWith('/redir/'))) {
          // Skip LinkedIn URLs, social media, and search engines
          if (href.includes('linkedin.com') || 
              href.includes('facebook.com') || 
              href.includes('twitter.com') || 
              href.includes('instagram.com') ||
              href.includes('youtube.com') ||
              href.includes('google.com') ||
              href.includes('bing.com') ||
              href.includes('yahoo.com') ||
              href.includes('duckduckgo.com')) {
            continue;
          }
          
          // Prefer links that look like official websites
          if (text.includes('website') || 
              text.includes('visit') || 
              text.includes('learn more') ||
              href.includes('/redir/')) {
            return href.includes('/redir/')
              ? this.extractRedirectUrl(href)
              : href;
          }
        }
      }
    }

    // Finally, try any external link that isn't social media
    const allLinks = $('a[href*="http"]');
    for (let i = 0; i < allLinks.length; i++) {
      const element = $(allLinks[i]);
      const href = element.attr('href');
      
      if (href && 
          !href.includes('linkedin.com') && 
          !href.includes('facebook.com') && 
          !href.includes('twitter.com') && 
          !href.includes('instagram.com') &&
          !href.includes('youtube.com') &&
          !href.includes('google.com') &&
          !href.includes('bing.com') &&
          !href.includes('yahoo.com') &&
          !href.includes('duckduckgo.com') &&
          (href.startsWith('http') || href.startsWith('/redir/'))) {
        return href.includes('/redir/')
          ? this.extractRedirectUrl(href)
          : href;
      }
    }

    return undefined;
  }

  private extractWebsiteFromDataTable($: cheerio.CheerioAPI): string | undefined {
    // Look for dt element containing "Website" and get the following dd element
    const websiteDt = $('dt').filter((_, el) => {
      const text = $(el).text().trim();
      return text === 'Website' || text.toLowerCase() === 'website';
    });
    
    if (websiteDt.length) {
      const websiteDd = websiteDt.next('dd');
      if (websiteDd.length) {
        // Look for a link in the dd element
        const link = websiteDd.find('a').first();
        if (link.length) {
          const href = link.attr('href');
          
          // Handle LinkedIn redirect URLs
          if (href && href.includes('/redir/redirect')) {
            const actualUrl = this.extractRedirectUrl(href);
            if (actualUrl && 
                !actualUrl.includes('linkedin.com') &&
                !actualUrl.includes('facebook.com') &&
                !actualUrl.includes('twitter.com') &&
                !actualUrl.includes('instagram.com') &&
                !actualUrl.includes('youtube.com') &&
                !actualUrl.includes('google.com') &&
                !actualUrl.includes('bing.com') &&
                !actualUrl.includes('yahoo.com') &&
                !actualUrl.includes('duckduckgo.com')) {
              return actualUrl;
            }
          }
          
          // Handle direct URLs
          if (href && href.startsWith('http')) {
            if (!href.includes('linkedin.com') &&
                !href.includes('facebook.com') &&
                !href.includes('twitter.com') &&
                !href.includes('instagram.com') &&
                !href.includes('youtube.com') &&
                !href.includes('google.com') &&
                !href.includes('bing.com') &&
                !href.includes('yahoo.com') &&
                !href.includes('duckduckgo.com')) {
              return href;
            }
          }
        }
        
        // If no link found in dd, check if the dd text itself is a URL
        const ddText = websiteDd.text().trim();
        if (ddText.startsWith('http') && 
            !ddText.includes('linkedin.com') &&
            !ddText.includes('facebook.com') &&
            !ddText.includes('twitter.com') &&
            !ddText.includes('instagram.com') &&
            !ddText.includes('youtube.com') &&
            !ddText.includes('google.com') &&
            !ddText.includes('bing.com') &&
            !ddText.includes('yahoo.com') &&
            !ddText.includes('duckduckgo.com')) {
          return ddText;
        }
      }
    }

    return undefined;
  }

  private extractRedirectUrl(redirectUrl: string): string {
    try {
      const url = new URL(redirectUrl, 'https://linkedin.com');
      
      // Handle LinkedIn redirect format: /redir/redirect?url=<encoded_url>
      const urlParam = url.searchParams.get('url');
      if (urlParam) {
        // Decode URL-encoded characters
        return decodeURIComponent(urlParam);
      }
      
      return redirectUrl;
    } catch {
      return redirectUrl;
    }
  }

  private extractIndustry($: cheerio.CheerioAPI): string | undefined {
    return this.extractInfoByLabel($, ['Industry', 'industry']);
  }

  private extractCompanySize($: cheerio.CheerioAPI): string | undefined {
    return this.extractInfoByLabel($, ['Company size', 'company size', 'Size']);
  }

  private extractHeadquarters($: cheerio.CheerioAPI): string | undefined {
    return this.extractInfoByLabel($, [
      'Headquarters',
      'headquarters',
      'Location',
    ]);
  }

  private extractFoundedYear($: cheerio.CheerioAPI): number | undefined {
    const founded = this.extractInfoByLabel($, ['Founded', 'founded']);
    if (founded) {
      const year = founded.match(/\d{4}/);
      return year ? parseInt(year[0], 10) : undefined;
    }
    return undefined;
  }

  private extractSpecialties($: cheerio.CheerioAPI): string[] | undefined {
    const specialties = this.extractInfoByLabel($, [
      'Specialties',
      'specialties',
    ]);
    if (specialties) {
      return specialties
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return undefined;
  }

  private extractInfoByLabel(
    $: cheerio.CheerioAPI,
    labels: string[]
  ): string | undefined {
    for (const label of labels) {
      // Company page info items in summary section
      const infoSelectors = [
        `.org-top-card-summary-info-list__info-item:contains("${label}")`,
        `.org-page-details__definition-term:contains("${label}") + .org-page-details__definition-text`,
        `dt:contains("${label}") + dd`,
        `.about-us-organization-overview__definition-term:contains("${label}") + .about-us-organization-overview__definition-description`,
      ];

      for (const selector of infoSelectors) {
        const element = $(selector).first();
        if (element.length) {
          let text = element.text().trim();
          
          // If this is an info item, extract just the value part
          if (selector.includes('info-item')) {
            const parts = text.split('\n').map(p => p.trim()).filter(p => p);
            // Look for the part that's not the label
            for (const part of parts) {
              if (!labels.some(l => part.toLowerCase().includes(l.toLowerCase()))) {
                text = part;
                break;
              }
            }
          }
          
          if (text && !labels.some(l => text.toLowerCase() === l.toLowerCase())) {
            return text;
          }
        }
      }

      // Generic label/value patterns
      const labelSelectors = [
        `:contains("${label}:")`,
        `[aria-label*="${label}"]`,
        `[data-test*="${label.toLowerCase()}"]`,
      ];

      for (const labelSelector of labelSelectors) {
        const labelElement = $(labelSelector).first();
        if (labelElement.length) {
          const nextElement = labelElement.next();
          if (nextElement.length) {
            const text = nextElement.text().trim();
            if (text) return text;
          }

          const parent = labelElement.parent();
          const valueInParent = parent
            .text()
            .replace(labelElement.text(), '')
            .replace(label + ':', '')
            .trim();
          if (valueInParent) return valueInParent;
        }
      }
    }

    return undefined;
  }

  private extractLogo($: cheerio.CheerioAPI): string | undefined {
    // Method 1: Look for structured data (JSON-LD, meta tags, etc.)
    const jsonLdScripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < jsonLdScripts.length; i++) {
      try {
        const jsonData = JSON.parse($(jsonLdScripts[i]).html() || '');
        if (jsonData.logo) {
          const logoUrl = typeof jsonData.logo === 'string' ? jsonData.logo : jsonData.logo?.url;
          if (logoUrl) {
            return logoUrl;
          }
        }
      } catch {
        // Ignore JSON parsing errors
      }
    }
    
    // Method 2: Look for Open Graph image (most reliable for LinkedIn)
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && ogImage.includes('logo')) {
      return ogImage;
    }
    
    // Method 3: Look for favicon or icon links
    const favicon = $('link[rel*="icon"]').attr('href');
    if (favicon && favicon.startsWith('http')) {
      return favicon;
    }
    
    // Method 4: Search page HTML for logo image URLs
    const pageHTML = $.html();
    const imageUrlRegex = /https:\/\/media\.licdn\.com\/dms\/image\/[^"'\s]+/g;
    const imageUrls = pageHTML.match(imageUrlRegex) || [];
    
    for (const url of imageUrls) {
      // LinkedIn logo URLs often contain these patterns
      if (url.includes('/company-logo/') || 
          url.includes('logo') || 
          url.includes('brand') ||
          (url.includes('image-shrink_') && url.includes('company'))) {
        return url;
      }
    }
    
    // Method 5: Traditional image tag search with enhanced attributes
    const allImages = $('img');
    
    for (let i = 0; i < allImages.length; i++) {
      const element = $(allImages[i]);
      const alt = element.attr('alt') || '';
      const className = element.attr('class') || '';
      
      // Check if this might be the company logo based on alt text and class
      if (alt && className.includes('entity-image') && alt !== '' && !alt.includes('cover')) {
        // Try to extract the image URL from various possible attributes
        const attrs = ['src', 'data-src', 'data-delayed-url', 'data-ghost-url', 'data-original'];
        for (const attr of attrs) {
          const url = element.attr(attr);
          if (url && url !== 'undefined' && url.startsWith('http')) {
            return url;
          }
        }
        
        // If no direct URL, try to find it in the element's style attribute
        const style = element.attr('style') || '';
        const bgImageMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
        if (bgImageMatch && bgImageMatch[1]) {
          return bgImageMatch[1];
        }
      }
    }
    
    // Method 6: Look for the first valid LinkedIn media image (fallback)
    for (const url of imageUrls.slice(0, 5)) {
      if (!url.includes('cover') && !url.includes('banner') && url.includes('media.licdn.com')) {
        return url;
      }
    }
    
    return undefined;
  }

  private extractFollowers($: cheerio.CheerioAPI): number | undefined {
    // Company page selectors for follower count
    const selectors = [
      '.org-top-card-summary-info-list__info-item:contains("followers")',
      '.top-card-layout__follower-count',
      '[data-test="followers-count"]',
      ':contains("followers")',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text();
        const match = text.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*followers/i);
        if (match && match[1]) {
          const count = match[1].replace(/,/g, '');
          
          // Handle K, M, B suffixes
          if (count.includes('K')) {
            return Math.round(parseFloat(count) * 1000);
          } else if (count.includes('M')) {
            return Math.round(parseFloat(count) * 1000000);
          } else if (count.includes('B')) {
            return Math.round(parseFloat(count) * 1000000000);
          }
          
          return parseInt(count, 10);
        }
      }
    }

    return undefined;
  }
}

export const linkedinScraper = new LinkedInCompanyScraper();
