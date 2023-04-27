describe('syndicus tests', () => {
  beforeEach(() => {
    cy.login('syndicusr@trottoir.be', 'syndicus')
    cy.visit('/planning')
  })

})
