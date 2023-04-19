describe('login tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // TODO .only wegdoen wanneer api niet meer crasht bij foutieve login
  it.only('log in succesfull', () =>{
    cy.login('administrator@trottoir.be', 'password')
    cy.visit('/planning')
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
    cy.get('#login')
  })

})
