describe('admin tests', () => {
  beforeEach(() => {
    cy.login('administrator@trottoir.be', 'administrator')
    cy.visit('/planning')
  })

  it('add new user', () => {
    // go to user overview
    // click new user
    // add user data
    // save
  })

  it('edit a user', () => {
    // go to user overview
    // click user
    // press edit button
    // alter user data
    // save
  })

  it('delete a user', () => {
    // go to user overview
    // click user
    // press edit button
    // press delete
    // press confirm
  })

  it('check the profitability statistics', () => {
    // not yet implemented
  })

  it('add garbage schedule to a building', () => {
    cy.visit('/gebouw')
    // select building
  })

  it('edit garbage schedule of a building', () => {
    cy.visit('/gebouw')
    // select building
  })





})
