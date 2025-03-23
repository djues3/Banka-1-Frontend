module.exports = {
  e2e: {
    baseUrl: "https://localhost",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
};
