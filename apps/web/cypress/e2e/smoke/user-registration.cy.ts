import { setupClerkTestingToken } from '@clerk/testing/cypress';

describe('User Registration', () => {
  const now = new Date().getTime();

  beforeEach(() => {
    // Intercept all requests and add a custom header
    cy.intercept('*', (req) => {
      req.headers['x-vercel-protection-bypass'] = Cypress.env(
        'VERCEL_AUTOMATION_BYPASS_SECRET',
      );
    });
  });

  it('should register a new user and complete onboarding', () => {
    setupClerkTestingToken();

    cy.visit('/sign-up');
    cy.url().should('include', '/sign-up');

    cy.contains('Create your account');

    const emailField = cy.get('input[name="emailAddress"]');
    const passwordField = cy.get('input[name="password"]');
    const submitButton = cy.get('button').contains('Continue');

    // Fill in the email and password fields and click the continue button
    emailField.type(`richard+${now}_e2e@westmorelandcreative.com`);
    passwordField.type(Cypress.env('CLERK_PASSWORD'));
    submitButton.click();

    // The onboarding page options should be visible
    cy.get('[data-testid=between-jobs]').should('be.visible');
    cy.get('[data-testid=just-graduated]').should('be.visible');
    cy.get('[data-testid=employed-and-looking]').should('be.visible');
    cy.get('[data-testid=other]').should('be.visible');

    // Click the just graduated option
    cy.get('[data-testid=just-graduated]').click();

    // Click the continue to dashboard button
    cy.get('button').contains('Continue to Dashboard').click();

    // The dashboard page should be visible
    cy.url().should('include', '/dashboard');
    cy.contains('No applications yet');
  });
});
