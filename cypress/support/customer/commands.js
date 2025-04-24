/**
 * Login command to authenticate a customer
 * @param {string} email - Customer's email
 * @param {string} password - Customer's password
 */
Cypress.Commands.add('login', (email = 'jpavlovic6521rn@raf.rs', password = 'Jov@njovan1') => {
    cy.visit('/')
    // cy.visit('/login')

    cy.wait(1500)
    cy.get('.css-8atqhb > .MuiButtonBase-root').should('be.visible').click();

    cy.origin("https://idp.localhost", {args: {email, password }}, ({email, password}) => {
        cy.get('#email').should('be.visible').clear().type(email);
        cy.get('#password').should('be.visible').clear().type(password);
        cy.get('button[type="submit"]').should('be.visible').click();
    })

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
  cy.contains('Welcome to Banka1 – your trusted digital bank.').should('be.visible');
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
    cy.get(':nth-child(1) > .MuiGrid-container > :nth-child(2)').clear().type('1000');
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
    cy.wait(1000);
    //Select data
    cy.get('div[role="combobox"]').eq(0).should('be.visible').click();
    cy.get('ul[role="listbox"] li').first().click();
    cy.get('div[role="combobox"]').eq(2).should('be.visible').click();
    cy.get('ul[role="listbox"] li').first().click();

    cy.contains("Confirm").click()
})

Cypress.Commands.add('pay', () => {
  //Opens hamburger and 
  cy.get('.swiper-slide-active > .MuiBox-root > .MuiPaper-root > .MuiCardActions-root > .MuiButton-root').click();

  cy.get('#accountSelect').select(1);


  cy.get('[style="display: flex; align-items: center; gap: 8px;"] > .MuiButtonBase-root').click()

  cy.get('.MuiBox-root > .MuiList-root > :nth-child(1)').click()


  // cy.get('.recipient-account > input').type('111000100000000110');

  cy.get('.payment-purpose > input').type('Test payment');

  cy.get('.amount > input').type('1000');

  cy.get('.adress > input').type('Test address');

  cy.get('.reference-number > input').type('123');

  cy.get('.reference-row > .MuiButtonBase-root').click();

  cy.get('#verification-modal-title').should('be.visible');

  cy.get('.MuiButton-outlined').click();

  cy.get('[style="display: flex; justify-content: flex-end; padding: 16px;"] > button').click();

  cy.get('[style="flex: 1 1 0%; padding: 8px 16px; border-radius: 8px; background-color: rgb(244, 67, 54); color: rgb(255, 255, 255); border: medium; cursor: pointer; font-weight: 600;"]').click()


})

Cypress.Commands.add('assist', () => {
  //Opens hamburger and 
  cy.get('.css-cvcdt5-MuiButtonBase-root-MuiIconButton-root').click();

  

  cy.get('.css-1np12t0 > .MuiPaper-root').should('be.visible');

  cy.get('.css-aa5w9d > .MuiButtonBase-root').click();
})

Cypress.Commands.add('card', () => {
  cy.get('button[aria-label="open drawer"]').click();

  cy.get(':nth-child(5) > .MuiButtonBase-root').click();

  cy.get('.css-1wk2x82 > .MuiButtonBase-root').click();

  cy.get(':nth-child(2) > .MuiInputBase-root > .MuiSelect-select').click();

  cy.contains('111000100011000101').click();

  cy.get(':nth-child(4) > .MuiInputBase-root > .MuiSelect-select').click();
  cy.contains('Visa').click();
  cy.get('.css-nbc8x7 > .MuiBox-root > .MuiButton-containedPrimary').click();
})

Cypress.Commands.add('sec', () => {
  cy.get('button[aria-label="open drawer"]').click();

  cy.get(':nth-child(7) > .MuiButtonBase-root').click();

  cy.contains('GOOGL')

  // cy.get('.MuiDataGrid-row--firstVisible > [data-field="Details"] > .MuiButtonBase-root').click()
  // cy.get('.css-1gsycar > :nth-child(4) > .MuiFormControl-root').type('43434');
  //
  // cy.get(':nth-child(5) > .MuiFormControl-root').type('4343');
  //
  // cy.get('.css-1gsycar > .css-wb57ya-MuiFormControl-root-MuiTextField-root').click();
  //
  // cy.contains('111000100011000101').click();
  //
  // cy.get('.css-1d1jiby > .MuiButton-contained').click();
  // cy.get('.css-1gsycar > .MuiBox-root > .MuiButton-contained').click();
})

Cypress.Commands.add('applyLoan', () => {
    //Fill the form 
    cy.get('button[aria-label="open drawer"]').click();
    cy.contains('Loans').click();
    cy.contains("Loans Overview").should('be.visible');
    cy.contains("Apply for loan").click();
    cy.contains("New Loan Request").should('be.visible')
    cy.get(':nth-child(2) > .MuiInputBase-root > .MuiSelect-select').should('be.visible').click();
    cy.get('ul[role="listbox"] li').first().click();
    cy.get(':nth-child(4) > .css-q8hpuo-MuiFormControl-root > .MuiInputBase-root > .MuiSelect-select').should('be.visible').click();
    cy.get('ul[role="listbox"] li').first().click();
    cy.contains('Loan amount')  
      .parent() 
      .find('input')  
      .clear()
      .type('1000')
      .should('have.value', '1000');
    cy.contains('Loan purpose')  
      .parent() 
      .find('input')  
      .clear()
      .type('Svasta')
      .should('have.value', 'Svasta');
    cy.get(':nth-child(6) > .MuiInputBase-root > .MuiSelect-select').should('be.visible').click();
    cy.get('ul[role="listbox"] li').first().click();
    cy.contains('Salary amount')  
      .parent() 
      .find('input')  
      .clear()
      .type('1200')
      .should('have.value', '1200');
    cy.get(':nth-child(9) > .css-q8hpuo-MuiFormControl-root > .MuiInputBase-root > .MuiSelect-select').should('be.visible').click();
    cy.get('ul[role="listbox"] li').first().click();
    cy.contains('Employment duration (months)')  
      .parent() 
      .find('input')  
      .clear()
      .type('1000')
      .should('have.value', '1000');
    cy.contains('Phone number')  
      .parent() 
      .find('input')  
      .clear()
      .type('+38161130211')
      .should('have.value', '+38161130211');
    cy.contains("Submit").should('be.visible').click();
    
})

