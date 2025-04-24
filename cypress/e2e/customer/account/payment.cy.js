import { login, logout,  pay} from '../../../support/customer/commands';

describe('Limit Change Flow', () => {
    beforeEach(() => {
        // Start clean
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
        cy.clearAllSessionStorage();
    });
  
    it('should log in and log out successfully', () => {
      // Use your custom login command
      cy.login('jpavlovic6521rn@raf.rs', 'Jov@njovan1');
  
      // Verify dashboard content is visible
      cy.verifyLoggedIn();
  
    
     cy.pay();
        
  
      // Confirm we're back on the login page
      cy.contains('Login').should('be.visible');
    });
  });
  