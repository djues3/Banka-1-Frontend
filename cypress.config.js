module.exports = {
  projectId: '8ew3yz',
  e2e: {
    baseUrl: "https://localhost",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,  // Enabling support file
    
    // Global timeout settings
    defaultCommandTimeout: 10000,       // Wait longer for commands
    pageLoadTimeout: 60000,            // Wait up to 60s for page loads
    requestTimeout: 15000,             // Wait longer for XHR requests
    responseTimeout: 30000,            // Wait longer for responses
    
    // Retry settings
    retries: {
      runMode: 2,                      // Retry failed tests twice in headless mode
      openMode: 0                      // Don't retry in interactive mode
    },
    
    // Browser settings
    chromeWebSecurity: false,          // Disable for HTTPS/cross-origin issues
    viewportWidth: 1280,
    viewportHeight: 800,
    testIsolation: true,
    video: true                        // Save videos for debugging failed tests
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
};