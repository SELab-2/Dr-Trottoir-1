describe('login tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('log in succesfull', () =>{
    cy.login('administrator@trottoir.be', 'administrator')
  })

  it('log out', () =>{
    // in these test, saved sessions should be cleared
    // otherwise it always restores the first login
    Cypress.session.clearAllSavedSessions()
    // there is a check in the login function to see if it passed
    cy.login('administrator@trottoir.be', 'administrator')
    cy.visit('/account')
    cy.get('#logout').click()
    // we should be back at the log in
    cy.get('#login')
  })

  it('log in failed: incorrect password', () =>{
    Cypress.session.clearAllSavedSessions()
    cy.get('#email').type('administrator@trottoir.be')
    cy.get('#password').type('incorrectpassword')
    cy.get('#login').click()
    // we should have stayed on the login screen
    cy.get('#login')
  })

  it('log in failed: incorrect email', () =>{
    Cypress.session.clearAllSavedSessions()
    cy.get('#email').type('administrator@trotwaar.be')
    cy.get('#password').type('administrator')
    cy.get('#login').click()
    // we should have stayed on the login screen
    cy.get('#login')
  })

  // TODO: user doesn't yet have a login
  it('ask login data', () => {
    Cypress.session.clearAllSavedSessions()
    cy.get('#contact').click()
    cy.get('#popup').should('be.visible')
    // example@drtrottoi in the popup is still a hardcoded email, this will be changed
  })

})
