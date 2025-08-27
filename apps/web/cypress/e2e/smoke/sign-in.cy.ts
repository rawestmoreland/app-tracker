import { setupClerkTestingToken } from '@clerk/testing/cypress';

describe('Visit the sign in page', () => {
  it('should visit the sign in page', () => {
    setupClerkTestingToken();

    cy.visit('/');

    cy.contains('App Track');

    // cy.visit('/sign-in');
    // cy.url().should('include', '/sign-in');

    // cy.contains('Sign in to App Track');

    // cy.clerkSignIn({
    //   strategy: 'password',
    //   identifier: Cypress.env('CLERK_USERNAME'),
    //   password: Cypress.env('CLERK_PASSWORD'),
    // });

    // cy.visit('/dashboard');
  });
});
