describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it.only('log in succesfull', () =>{
    cy.get('.email').type('jens.pots@ugent.be')
    cy.get('.password').type('password')
    cy.get('.login').click() // of via enter drukken?
    // moet eerst linksboven klikken om afmeld knop te bekomen
    cy.get('.flex').click()
    // afmelden
    cy.get('.logout').click()
  })

  it('log in failed: incorrect password', () =>{
    cy.get('.email').type('jens.pots@ugent.be')
    cy.get('.password').type('incorrectpassword')
    cy.get('.login').click()
  })

  it('log in failed: incorrect email', () =>{
    cy.get('.email').type('jenspots@ugent.be')
    cy.get('.password').type('password')
    cy.get('.login').click()
  })

})
