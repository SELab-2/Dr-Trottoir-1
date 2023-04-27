describe('student tests', () => {
  beforeEach(() => {
    cy.login('tudent@trottoir.be', 'student')
    cy.visit('/planning')
  })


  it('wijzig account, maar annuleer', () => {
    // own db still rough, so based on selab2-1.ugent.be,
    // there are still some bugs
    cy.get('#account').click()
    cy.get('#edit').click()
    cy.get('#personal').then(() => {
      cy.get('#phone').clear()
      // cancel button should not be clickable when a field does not meet the requirements,
      // this is still possible now
      cy.get('#phone').type('0111111111')
      cy.get('#email').type('{backspace}') // depends on position of cursor
    })
    cy.get('#address').then(() => {
      cy.get('#street').type('t')
      cy.get('#streetnr').type('{backspace}')
      cy.get('#city').type('olkn')
      cy.get('#zipcode').type('1')
    })
    cy.get('#cancel').click()
    cy.get('#personal').get('#phone').should('not.contain.text', '0111111111')
    // cancel keeps the changes, but doesn't push to db, so on reload the changes are gone
    // obviously the changes should be gone once cancel is pushed, and not just on reload after cancel
  })

})
