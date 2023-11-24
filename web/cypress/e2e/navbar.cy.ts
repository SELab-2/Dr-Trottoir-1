describe('navigation bar tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('administrator@trottoir.be')
    cy.get('#password').type('administrator')
    cy.get('#login').click()
  })

  it('collapse and expand', () => {
    cy.get('#navbar-visible').click()
    cy.get('#logout').should('not.be.visible')
    cy.get('#navbar-visible').click()
    cy.get('#logout').should('be.visible')
    cy.get('#logout').click()
  })
})
