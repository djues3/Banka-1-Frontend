import { login, logout, CreateForeignBusinessAccount } from '../../support/admin/commands';

describe('Business Foreign Currency Account Creation', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('should create a business foreign currency account successfully', () => {
        cy.login('admin@admin.com', 'admin123');
        cy.verifyLoggedIn();

        cy.CreateForeignBusinessAccount();

        cy.logout();
        cy.contains('Login').should('be.visible');
    });
});
