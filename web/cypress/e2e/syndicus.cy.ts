describe('syndicus tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('syndicus@trottoir.be')
    cy.get('#password').type('syndicus')
    cy.get('#login').click()

  })

  it('check building', () => {
    // syndicus checks on one of their buildings
    cy.get('#building').first().click()
    cy.contains('Building 1')
    cy.contains('Taken')
    cy.contains('ID')
  })

})
