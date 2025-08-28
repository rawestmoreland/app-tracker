import { setupClerkTestingToken } from '@clerk/testing/cypress';

describe('User Registration', () => {
  const now = new Date().getTime();

  it('should register a new user', () => {
    setupClerkTestingToken();

    cy.visit('/sign-up');
    cy.url().should('include', '/sign-up');

    cy.contains('Create your account');

    const emailField = cy.get('input[name="emailAddress"]');
    const passwordField = cy.get('input[name="password"]');
    const submitButton = cy.get('button').contains('Continue');

    emailField.type(`richard+${now}@westmorelandcreative.com`);
    passwordField.type(Cypress.env('CLERK_PASSWORD'));
    submitButton.click();

    cy.contains('Welcome to App Track');
  });
});
