describe('Landing Page', () => {
    beforeEach(() => {
      // Increase default timeout for this test suite
      Cypress.config('defaultCommandTimeout', 10000);
      
      // Visit with retry logic
      cy.visit('https://localhost/', {
        timeout: 30000, // Increase visit timeout
        failOnStatusCode: false, // Don't fail on non-200 responses
        retryOnNetworkFailure: true
      });
      
      // Wait for page to be fully loaded
      cy.get('body').should('be.visible');
      cy.wait(1000); // Small wait to ensure all elements render
    });
  
    it('should display welcome message and login button', () => {
      // Check that welcome message is visible with extended timeout
      cy.contains('Welcome to 1Bank', { timeout: 10000 }).should('be.visible');
  
      // Check tagline
      cy.contains('Reliable. Agile. Forward-thinking.', { timeout: 5000 }).should('be.visible');
  
      // Check login button with more specific selector and wait
      cy.contains('Login to Dashboard', { timeout: 5000 })
        .should('be.visible')
        .should('not.be.disabled');
    });
  })