describe('Smoke: Application Loads', () => {
  it('should load the homepage', () => {
    cy.visitPreview('/');

    cy.contains('h1', 'Track Your Job Search');
  });

  it('should load critical static assets', () => {
    // Verify favicon is loading
    cy.request({
      url: '/favicon.ico',
      headers: {
        'x-vercel-protection-bypass': Cypress.env(
          'VERCEL_AUTOMATION_BYPASS_SECRET',
        ),
      },
    })
      .its('status')
      .should('eq', 200);

    // Verify health check endpoint is working
    cy.request({
      url: '/api/health',
      headers: {
        'x-vercel-protection-bypass': Cypress.env(
          'VERCEL_AUTOMATION_BYPASS_SECRET',
        ),
      },
    })
      .its('status')
      .should('eq', 200);

    // Verify CSS loaded (check for a styled element)
    cy.visitPreview('/');
    cy.get('a')
      .contains('Get Started')
      .should('have.css', 'background-color')
      .and('not.eq', 'rgba(0, 0, 0, 0)'); // Has some background
  });
});
