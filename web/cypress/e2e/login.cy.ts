describe('login tests', () => {
  beforeEach(() => {
    // in these test, saved sessions should be cleared
    // otherwise it always restores the first login
    //Cypress.session.clearAllSavedSessions()
    //cy.clearCookies()
    //cy.clearLocalStorage()
    //cy.clearAllSessionStorage({log: true})
    cy.visit('/')
  })

  it('log in and out succesfull', () =>{
    //cy.login('administrator@trottoir.be', 'administrator')
    //cy.visit('/account')
    cy.get('#email').type('administrator@trottoir.be')
    cy.get('#password').type('administrator')
    cy.get('#login').click()
    cy.get('#logout').click()
    // we should be back at the log in
    cy.get('#login')
  })

  it('log in failed: incorrect password', () =>{
    cy.get('#email').type('administrator@trottoir.be')
    cy.get('#password').type('incorrectpassword')
    cy.get('#login').click()
    // we should have stayed on the login screen
    cy.get('#login')
  })

  it('log in failed: incorrect email', () =>{
    cy.get('#email').type('administrator@trotwaar.be')
    cy.get('#password').type('administrator')
    cy.get('#login').click()
    // we should have stayed on the login screen
    cy.get('#login')
  })

  it('ask login data', () => {
    cy.get('#contact').click()
    cy.get('#popup').should('be.visible')
  })

})
