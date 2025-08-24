import { defineConfig } from 'cypress';
import { clerkSetup } from '@clerk/testing/cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({ config });
    },
    env: {
      CLERK_USERNAME: process.env.CLERK_USERNAME,
      CLERK_PASSWORD: process.env.CLERK_PASSWORD,
    },
  },
});
