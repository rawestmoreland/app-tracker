describe('Smoke: Application Loads', () => {
  it('should load the homepage', () => {
    cy.visitPreview('/');

    cy.contains('h1', 'Track Your Job Search');
  });

  it('should load critical static assets', () => {
    // Verify favicon is loading
    cy.request('/favicon.ico').its('status').should('eq', 200);

    // Verify health check endpoint is working
    cy.request('/api/health').its('status').should('eq', 200);

    // Verify CSS loaded (check for a styled element)
    cy.visit('/');
    cy.get('a')
      .contains('Get Started')
      .should('have.css', 'background-color')
      .and('not.eq', 'rgba(0, 0, 0, 0)'); // Has some background
  });
});
