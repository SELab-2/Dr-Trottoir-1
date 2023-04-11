describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/planning')
  })

  it.only('log out', () => {
    cy.get('.logout').click()
    cy.get('.login')
  })
})
