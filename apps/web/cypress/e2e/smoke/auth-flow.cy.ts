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
    cy.get('input[name="identifier"]').should('be.visible');

    cy.get('button').contains('Continue').should('not.be.disabled');

    // Don't actually sign in for smoke tests - it's too slow
    // Just verify the page isn't broken
  });
});
