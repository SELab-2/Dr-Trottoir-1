describe('syndicus tests', () => {
  beforeEach(() => {
    cy.login('syndicus@trottoir.be', 'syndicus')

  })

  it('check building', () => {
    // syndicus checks for comments left on one of their buildings
    cy.visit('/account/settings/4')
    cy.get('#building').first().click()
    cy.contains('Building 1')
    // can't change the date of Taken
  })

})
