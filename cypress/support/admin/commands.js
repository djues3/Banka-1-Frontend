// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Login command to authenticate a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
Cypress.Commands.add('login', (email = 'admin@admin.com', password = 'admin123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  
  // Wait for redirection to dashboard or home after login
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
  cy.contains('Welcome to the Admin Dashboard').should('be.visible');
});

/**
 * Add a new employee
 */
Cypress.Commands.add('addEmployee', () => {
  cy.get('button[aria-label="open drawer"]').click();
  cy.contains('Employees').click();
  cy.contains('Add Employee').click();

  const randomString = () => Math.random().toString(36).substring(2, 8);
  const randomEmail = () => `${randomString()}@test.com`;

  cy.get('input[name="firstName"]').type(`Ime${randomString()}`);
  cy.get('input[name="lastName"]').type(`Prezime${randomString()}`);
  cy.get('input[name="username"]').type(`user_${randomString()}`);
  cy.get('input[name="email"]').type(randomEmail());

  cy.get('input[name="phoneNumber"]').type('063457734');
  cy.get('input[name="address"]').type('Georgi Dimitrova 12');
  cy.get('input[name="birthDate"]').type('1995-01-01');

  cy.contains('Save').click();


});

/**
 * Block an employee
 */
Cypress.Commands.add('blockEmployee', () => {
  cy.get('button[aria-label="open drawer"]').click();
  cy.contains('Employees').click();

  cy.get('[data-rowindex="3"]').within(() => {
    // Find the switch input inside the "active" cell
    cy.get('[data-field="active"] input[type="checkbox"]').click({ force: true });
  });

});

/**
 * Change customer details
 */
Cypress.Commands.add('changeCustomerDetails', () => {
  cy.get('button[aria-label="open drawer"]').click();
  cy.contains('Customers').click();

  cy.get('[data-rowindex="3"]').click();

  cy.get('input[name="firstName"]').clear().type('Joca');

  cy.contains('Save').click();
});
/**
 * Add a new account
 */
Cypress.Commands.add('CreateAccount', () => {
  cy.get('button[aria-label="open drawer"]').click();
  cy.contains('Employee Bank Accounts').click();

  cy.contains('Add').click();

  cy.contains('Choose the account you want to create') 
  .parent()
  .find('[role="combobox"]') 
  .click();

// Select the first option from the list
  cy.get('[role="listbox"] [role="option"]').eq(1).click();


  cy.contains('Choose the type of account you want to create') 
  .parent()
  .find('[role="combobox"]') 
  .click();

// Select the first option from the list
  cy.get('[role="listbox"] [role="option"]').eq(1).click();

  
  cy.contains('Continue').click();

  cy.contains('Choose a customer') 
  .parent()
  .find('[role="combobox"]') 
  .click();

// Select the first option from the list
  cy.get('[role="listbox"] [role="option"]').eq(1).click();

  cy.contains('Make a card').click();

  cy.get('input[type="number"]').first().clear().type('99999');

  cy.contains('Confirm').click();
  
  });

  Cypress.Commands.add('denyLoan', () => {
    cy.get('button[aria-label="open drawer"]').click();
    cy.contains('Loans').click();
    cy.contains('Pending Loans').click();
  
    cy.get('[data-rowindex="0"]').within(() => {
      // Find the switch input inside the "active" cell
      cy.contains('Deny').click();
      cy.contains('Deny').click();
    });
  
  
  });