import { login, logout } from '../../support/customer/commands';

describe('Login and Logout Flow', () => {
    beforeEach(() => {
        // Start clean
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
        cy.clearAllSessionStorage();
    });
  
    it('should log in and log out successfully', () => {
      // Use your custom login command
      cy.login('marko.markovic@banka.com', 'M@rko12345');
  
      // Verify dashboard content is visible
      cy.verifyLoggedIn();
  
      // Use your custom logout command
      cy.logout();
  
      // Confirm we're back on the login page
      cy.contains('Login').should('be.visible');
    });
  });
  