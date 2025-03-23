describe('Landing Page', () => {
    it('should display welcome message and login button', () => {
      cy.visit('https://localhost/') 
  
      // Check that welcome message is visible
      cy.contains('Welcome to 1Bank').should('be.visible')
  
      // Check tagline
      cy.contains('Reliable. Agile. Forward-thinking.').should('be.visible')
  
      // Check login button
      cy.contains('Login to Dashboard')
        .should('be.visible')
    })
  })
  