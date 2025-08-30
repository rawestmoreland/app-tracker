import { setupClerkTestingToken } from '@clerk/testing/cypress';

describe('Sign in', () => {
  beforeEach(() => {
    cy.intercept('*', (req) => {
      req.headers['x-vercel-protection-bypass'] = Cypress.env(
        'VERCEL_AUTOMATION_BYPASS_SECRET',
      );
    });
  });
  it('should visit the sign in page as a new user', () => {
    setupClerkTestingToken();

    cy.visit('/sign-in');
    cy.url().should('include', '/sign-in');

    cy.contains('Sign in to App Track');

    cy.clerkSignIn({
      strategy: 'password',
      identifier: Cypress.env('CLERK_USERNAME'),
      password: Cypress.env('CLERK_PASSWORD'),
    });

    cy.visit('/dashboard');

    cy.contains('No applications yet');
  });
});
