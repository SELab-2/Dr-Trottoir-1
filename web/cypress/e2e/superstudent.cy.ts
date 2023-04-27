describe('superstudent tests', () => {
  beforeEach(() => {
    cy.login('superstudent@trottoir.be', 'super_student')
    cy.visit('/planning')
  })

})
