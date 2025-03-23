/**
 * Login command to authenticate a customer
 * @param {string} email - Customer's email
 * @param {string} password - Customer's password
 */
Cypress.Commands.add('login', (email = 'marko.markovic@banka.com', password = 'M@rko12345') => {
  cy.visit('/login');
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  

  cy.url().should('not.include', '/login');
});

/**
 * Logout command to sign out the current user
 */
Cypress.Commands.add('logout', () => {
  // Then click logout option
  cy.contains('Logout').click();

  cy.contains('Continue').click();
  
  // Verify we're redirected to login page
  cy.url().should('include', '/');
});

/**
 * Verify that the user is logged in by checking elements on the dashboard
 */
Cypress.Commands.add('verifyLoggedIn', () => {
  // Check for elements that should only be visible when logged in
  cy.contains('Fast Payment').should('be.visible');
});

/**
 * Limit change
 */
Cypress.Commands.add('limitChange', () => {
    //Opens hamburger and 
    cy.get('button[aria-label="open drawer"]').click();
    cy.contains('Accounts').click();
    cy.contains("Accounts Management").should('be.visible');
  
    cy.get('[data-rowindex="0"]').within(() => {
    // Find the switch input inside the "active" cell
     cy.contains('button', 'Details').click({ force: true });
    });
    cy.contains("Account Details").should('be.visible');
    //Limit change is clicked
    cy.contains("Limit Change").click();
    cy.get('input[type="number"]').clear().type('1000');
    cy.contains("SAVE").click();
    
})

/**
 * Create card
 */
Cypress.Commands.add('createCard', () => {
    //Opens hamburger and 
    cy.get('button[aria-label="open drawer"]').click();
    cy.contains('Cards').click();
    
    cy.contains("Add Card").should('be.visible');
    cy.contains("Add Card").click();
    

  
    //Limit change is clicked
  
    
})

