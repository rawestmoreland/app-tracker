describe('Smoke: API Health', () => {
  it('should respond to health check', () => {
    cy.request('/api/health', {
      headers: {
        'x-vercel-protection-bypass': Cypress.env(
          'VERCEL_AUTOMATION_BYPASS_SECRET',
        ),
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status', 'healthy');
      // Verify database connection
      expect(response.body).to.have.property('database', 'connected');
    });
  });
});
