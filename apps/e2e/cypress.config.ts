import { defineConfig } from 'cypress';
import { clerkSetup } from '@clerk/testing/cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({ config });
    },
    baseUrl: 'http://localhost:3000',
    env: {
      CLERK_USERNAME: process.env.CLERK_USERNAME,
      CLERK_PASSWORD: process.env.CLERK_PASSWORD,
    },
  },
});
