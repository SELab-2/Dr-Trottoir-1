describe('student tests', () => {
  beforeEach(() => {
    cy.login('student@trottoir.be', 'student')
    cy.visit('/planning')
  })


  it('student performs a round', () => {
    // we should already be at "/planning"
    // student selects round which he/her wants to start
    // you can start by clicking start on the round card, or by clicking on the card and then hit start
    cy.get('#round').first().click()
    // student goes to first building,
    cy.get('#building').first().then(()=>{
      cy.get('#start').click()
      // TODO
      // expand the card to add pictures and leave a comment
      // student indicates building as done
      cy.get("end").click()
    })
    // repeat for all buildings
    // student ends the round: automaticly ends when last building is marked as done
  })


  it('edit account, but cancel changes', () => {
    cy.get('#account').click()
    cy.get('#editcancel').click()
    cy.get('#personal').then(() => {
      cy.get('#phone').clear()
      cy.get('#phone').type('0111111111')
      cy.get('#email').type('{backspace}') // depends on position of cursor
    })
    cy.get('#address').then(() => {
      cy.get('#street').clear()
      cy.get('#street').type('t')
      cy.get('#streetnr').type('{backspace}')
      cy.get('#city').type('blabla')
      cy.get('#zipcode').type('1')
    })
    cy.get('#editcancel').click()
    // check if changes are undone
    cy.get('#personal').get('#phone').should('not.contain.text', '0111111111')
    cy.get('#address').get('#street').should('not.containt.text', 't')
  })

  it('edit account, save changes', () => {
    cy.get('#account').click()
    cy.get('#editcancel').click()
    cy.get('#personal').then(() => {
      cy.get('#phone').clear()
      cy.get('#phone').type('0111111111')
      cy.get('#email').type('{backspace}') // depends on position of cursor
    })
    cy.get('#address').then(() => {
      cy.get('#street').clear()
      cy.get('#street').type('t')
      cy.get('#streetnr').type('{backspace}')
      cy.get('#city').type('blabla')
      cy.get('#zipcode').type('1')
    })
    // cancel button should not be clickable when a field does not meet the requirements,
    // this is still possible now
    cy.get('#save').click()
    cy.get('#submit').click()
    // check if changes are saved
    cy.get('#personal').get('#phone').should('contain.text', '0111111111')
    cy.get('#address').get('#street').should('containt.text', 't')
  })
})
