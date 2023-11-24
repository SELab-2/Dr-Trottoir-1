describe('student tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('student@trottoir.be')
    cy.get('#password').type('student')
    cy.get('#login').click()
  })


  it('student performs a round', () => {
    // we should already be at "/planning"
    // student selects round which he/she wants to start
    // you can start by clicking start on the round card, or by clicking on the card and then hit start
    cy.get('#round').first().click()
    // student goes to first building,
    cy.get('#buildingcard').first().then(()=>{
      cy.contains('Start').click()
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
      cy.get("#upload-progress").selectFile('src/assets/images/drtroittoir_logo.png')
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
    // there used to be a bug where changes stay after cancellation
    // this test checks if that bug is gone
    cy.get('#account').click()
    cy.get('#editcancel').click()
    cy.get('#personal').then(() => {
      cy.get('#phone').clear()
      cy.get('#phone').type('0111111111')
      cy.get('#email').type('{backspace}{backspace}com')
    })
    cy.get('#address').then(() => {
      cy.get('#street').clear()
      cy.get('#street').type('street')
      cy.get('#streetnr').type('{backspace}1')
      cy.get('#city').type('blabla')
      cy.get('#zipcode').type('{backspace}1')
    })
    cy.get('#save').click()
    // there is now a popup to confirm or cancel
    cy.get('#cancel').click()
    // back on the edit screen
    cy.get('#editcancel').click()
    // check if changes are undone
    cy.get('#personal').get('#phone').should('not.contain.text', '0111111111')
    cy.get('#address').get('#street').should('not.contain.text', 'street')
  })

  it.only('edit account, save changes', () => {
    cy.get('#account').click()
    cy.get('#editcancel').click()
    cy.get('#personal').then(() => {
      cy.get('#phone').clear()
      cy.get('#phone').type('0123456789')
      cy.get('#email').type('{backspace}{backspace}com')
    })
    cy.get('#address').then(() => {
      cy.get('#street').clear()
      cy.get('#street').type('street')
      cy.get('#streetnr').type('{backspace}1')
      cy.get('#city').type('blabla')
      cy.get('#zipcode').type('{backspace}1')
    })
    cy.get('#password').type('ni3uwW@chtwoord') // password has to meet the requirements
    cy.get('#repeat').type('ni3uwW@chtwoord')
    cy.get('#save').click()
    cy.get('#submit').click()
    // check if changes are saved
    cy.get('#personal').get('#phone').should('contain.text', '0111111111')
    cy.contains('0111111111')
    cy.get('#address').get('#street').should('contain.text', 'street')
    cy.contains('street')

    // test if password is changed
    cy.get('#logout').click()
    cy.get('#email').type('student@trottoir.com')
    cy.get('#password').type('ni3uwW@chtwoord')
    cy.get('#login').click()
    // we should be logged back in and see the logout button
    cy.get('#logout').should('be.visible')
  })
})
