describe('admin tests', () => {
  // TODO check if cy.contains('X') works instead of cy.get(..).get(...).contains('X')
  beforeEach(() => {
    cy.login('administrator@trottoir.be', 'administrator')
    cy.visit('/ronde/overzicht')
  })

  it('add new user', () => {
    // go to user overview
    cy.get('#users').click()
    // click new user
    cy.get('#newuser').click()
    // add user data
    cy.get('#firstname').type('test')
    cy.get('#lastname').type('naam')
    cy.get('#personal').then(() => {
      cy.get('#phone').type('0123456789')
      cy.get('#email').type('test@trottoir.be')
    })
    cy.get('#address').then(() => {
      cy.get('#street').type('teststraat')
      cy.get('#streetnr').type('1')
      cy.get('#city').type('Teststad')
      cy.get('#zipcode').type('1234')
    })
    cy.get('#password').type('testwachtwoord')
    cy.get('#repeat').type('testwachtwoord')
    cy.get('#roles').then(() => {
      cy.get('#student').check()
      cy.get('#superstudent').check()
      cy.get('#administrator').check()
    })
    cy.get('#create').click()
    // check if user in userlist
    cy.get('#usertable').get('#table').contains('td', 'test naam')
  })

  it('edit a user', () => {
    // go to user overview
    cy.get('#users').click()
    // click user
    cy.get('#usertable').get('#table').contains('td', 'test naam').click()
    // press edit button
    cy.get('#edit').click()
    // alter user data
    // most of this has been tested in the student tests,
    // however only admins can change name, roles or password of a user
    cy.get("#firstname").clear().type("nieuwe")
    cy.get("#lastname").clear().type("gebruiker")
    cy.get('#roles').then(() => {
      cy.get('#administrator').uncheck()
    })
    cy.get('#password').type('nieuwwachtwoord')
    cy.get('#repeat').type('nieuwwachtwoord')
    // save
    cy.get('#save').click()
    // confirm
    cy.get('#submit').click()
    // check if user is updated in the table
    // cy.get('#users').click()
    cy.get('#usertable').get('#table').contains('td', 'nieuwe gebruiker')
  })

  it('delete a user', () => {
    // go to user overview
    cy.get('#users').click()
    // click user
    cy.get('#usertable').get('#table').contains('td', 'nieuwe gebruiker').click()
    // press edit button
    cy.get('#edit').click()
    // press delete
    cy.get('#delete').click()
    // press confirm
    cy.get('#submit').click()
    // user should not be present in the table
    // cy.get('#users').click()
    cy.get('#usertable').get('#table').contains('td', 'nieuwe gebruiker').should('not.exist')
  })

  it('check the profitability statistics', () => {
    // not yet implemented
  })

  it('add garbage schedule to a building', () => {
    cy.get('#buildings').click()
    // select building
    cy.get('#buildingtable').get('#table').contains('td', 'Building 1').click()

  })

  it('edit garbage schedule of a building', () => {
    cy.get('#buildings').click()
    // select building
    cy.get('#buildingtable').get('#table').contains('td', 'Building 1').click()
  })





})
