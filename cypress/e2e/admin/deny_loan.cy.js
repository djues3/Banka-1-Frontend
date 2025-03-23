import { login, logout, denyLoan} from '../../support/admin/commands';

describe('Create account flow', () => {
    beforeEach(() => {
      // Start clean
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  
    it('should log in and log out successfully', () => {
      // Use your custom login command
      cy.login('admin@admin.com', 'admin123');
  
      // Verify dashboard content is visible
      cy.verifyLoggedIn();

  
      // Use your custom logout command
      cy.logout();
  
      // Confirm we're back on the login page
      cy.contains('Login').should('be.visible');
    });
  });