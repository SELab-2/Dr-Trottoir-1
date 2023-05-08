describe('login tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('log in succesfull', () =>{
    cy.login('administrator@trottoir.be', 'password')
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
    cy.get('#password').type('password')
    cy.get('#login').click()
    // we should have stayed on the login screen
    cy.get('#login')
  })

  // TODO: user doesn't yet have a login
  it('ask login data', () => {
    cy.get('#contact').click()
    cy.contains('Indien je nog geen account hebt en graag lid wilt worden van DR.Trottoir neem dan contact op met ons via example@drtrottoir.be')
      .should('be.visible')
    // example@drtrottoi is still a hardcoded email, this will be changed
  })

  it('log out', () =>{
    // there is a check in the login function to see if it passed
    cy.login('administrator@trottoir.be', 'password')
    cy.get('#logout').click()
    // we should be back at the log in
    cy.get('#login')
  })

})
