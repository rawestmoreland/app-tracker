import { linkedinScraper } from './dist/index.js';

async function runScraper() {
  const companyName = process.argv[2];
  
  if (!companyName) {
    console.log('Usage: node run-scraper.js "Company Name"');
    console.log('Example: node run-scraper.js "Going"');
    process.exit(1);
  }

  console.log(`Scraping LinkedIn data for: ${companyName}`);
  console.log('Please wait...\n');

  try {
    const result = await linkedinScraper.scrapeCompanyByName(companyName);
    
    if (result.success && result.data) {
      console.log('✅ Success! Company data:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Failed to scrape company data:');
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.log('❌ Unexpected error:');
    console.log(error.message);
  }
}

runScraper();