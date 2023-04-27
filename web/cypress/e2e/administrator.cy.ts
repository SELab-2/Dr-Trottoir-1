describe('admin tests', () => {
  beforeEach(() => {
    cy.login('administrator@trottoir.be', 'administrator')
    cy.visit('/planning')
  })



})
