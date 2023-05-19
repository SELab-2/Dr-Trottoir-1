describe('student tests', () => {
  beforeEach(() => {
    cy.login('student@trottoir.be', 'student')
    cy.visit('/planning')
  })


  it('student performs a round', () => {
    // we should already be at "/planning"
    // student selects round which he/she wants to start
    // you can start by clicking start on the round card, or by clicking on the card and then hit start
    cy.get('#round').first().click()
    // student goes to first building,
    cy.get('#building').first().then(()=>{
      cy.get('#start').click()
      // TODO
      // expand the card to add pictures and leave a comment
      cy.get('#expand').click()
      // add a comment
      cy.get('#addcomment').click()
      cy.get('#writecomment').type('This is a commen')
      cy.get('#savecomment').click()
      // oh no, we made a spelling error. Luckily we can edit our comment!
      cy.get('#editcomment').click()
      cy.get('#writecomment').type('t.')
      cy.get('#savecomment').click()
      // add images
      // add arrival image
      cy.get('#addimage').click()
      cy.get("#select").selectFile('src/assets/images/drtroittoir_logo.png')
      //the standard type is arrival, so doesn't need change here
      cy.get('#comment').type('Arrival picture.')
      cy.get('#save').click()
      // add departure image
      cy.get('#addimage').click()
      cy.get("#select").selectFile('src/assets/images/drtroittoir_logo.png')
      cy.get('#type').parent().click()
      cy.contains('DEPARTURE').click()
      cy.get('#comment').type('Departure picture.')
      cy.get('#save').click()
      // student indicates building as done
      cy.get("eindig").click()
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
      cy.get('#street').type('street')
      cy.get('#streetnr').type('{backspace}')
      cy.get('#city').type('blabla')
      cy.get('#zipcode').type('1')
    })
    cy.get('#save').click()
    // there is now a popup to confirm or cancel
    cy.get('#cancel').click()
    // back on the edit screen
    cy.get('#editcancel').click()
    // check if changes are undone
    cy.get('#personal').get('#phone').should('not.contain.text', '0111111111')
    cy.get('#address').get('#street').should('not.containt.text', 'street')
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
      cy.get('#street').type('street')
      cy.get('#streetnr').type('{backspace}')
      cy.get('#city').type('blabla')
      cy.get('#zipcode').type('1')
    })
    cy.get('#password').type('ni3uwW@chtwoord') // password has to meet the requirements
    cy.get('#repeat').type('ni3uwW@chtwoord')
    cy.get('#save').click()
    cy.get('#submit').click()
    // check if changes are saved
    cy.get('#personal').get('#phone').should('contain.text', '0111111111')
    cy.get('#address').get('#street').should('containt.text', 'street')
  })
})
