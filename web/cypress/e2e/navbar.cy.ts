describe('navigation bar tests', () => {
  beforeEach(() => {
    cy.login('administrator@trottoir.be', 'password')
    cy.visit('/planning')
  })

  it('collapse and expand', () => {
    cy.get('#navbar-visible').click()
    cy.get('#logout').should('not.be.visible')
    cy.get('#navbar-visible').click()
    cy.get('#logout').should('be.visible')
  })
})
