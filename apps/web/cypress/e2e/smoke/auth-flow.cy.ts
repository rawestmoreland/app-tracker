import { setupClerkTestingToken } from '@clerk/testing/cypress';

describe('Sign in', () => {
  it('should visit the sign in page as a new user', () => {
    setupClerkTestingToken();

    cy.visitPreview('/sign-in');
    cy.get('input[name="identifier"]').should('be.visible');

    cy.get('button').contains('Continue').should('not.be.disabled');

    // Don't actually sign in for smoke tests - it's too slow
    // Just verify the page isn't broken
  });
});
