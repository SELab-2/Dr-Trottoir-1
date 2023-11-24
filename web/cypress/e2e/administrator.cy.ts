describe('admin tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#email').type('administrator@trottoir.be')
    cy.get('#password').type('administrator')
    cy.get('#login').click()
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
      cy.get('#streetnr').type('{backspace}1')
      cy.get('#city').type('Teststad')
      cy.get('#zipcode').type('{backspace}1234')
    })
    cy.get('#password').type('t3stw@chtwOord')
    cy.get('#repeat').type('t3stw@chtwOord')
    cy.get('#roles').then(() => {
      cy.get('#student').check()
      cy.get('#superstudent').check()
      cy.get('#administrator').check()
    })
    cy.get('#create').click()
    // confirm
    // cy.get('#submit').click()
    // we are now at the new user page
    cy.contains('test naam')
    cy.contains('Persoonlijke gegevens')
    // check if user in userlist
    cy.get('#users').click()
    cy.contains('test naam')
  })

  it('edit a user', () => {
    // go to user overview
    cy.get('#users').click()
    // click user
    cy.contains('test naam').click()
    // press edit button
    cy.get('#editcancel').click()
    // alter user data
    // most of this has been tested in the student tests,
    // however only admins can change name or roles of a user
    cy.get("#firstname").clear().type("nieuwe")
    cy.get("#lastname").clear().type("gebruiker")
    cy.get('#roles').then(() => {
      cy.get('#administrator').uncheck()
    })
    // save
    cy.get('#save').click()
    // confirm
    cy.get('#submit').click()
    // check if user is updated in the table
    // cy.get('#users').click()
    cy.contains('nieuwe gebruiker')
  })

  it('delete a user', () => {
    // go to user overview
    cy.get('#users').click()
    // click user
    cy.contains('nieuwe gebruiker').click()
    // press edit button
    cy.get('#editcancel').click()
    // press delete
    cy.get('#delete').click()
    // press confirm
    cy.get('#submit').click()
    cy.contains('Deze account is verwijderd')
    // user should not be present in the table
    cy.get('#users').click()
    cy.contains('nieuwe gebruiker').should('not.exist')
  })

  it('restore deleted user', () => {
    // go to user overview
    cy.get('#users').click()
    // see hidden users
    cy.get('#hidden').check()
    // click user
    cy.contains('nieuwe gebruiker').click()
    cy.get('#restore').click()
    // messaeg saying user is deleted should be gone
    cy.contains('Deze account is verwijderd').should('not.exist')
  })

  it('check the profitability statistics user', () => {
    // go to user overview
    cy.get('#users').click()
    // click user
    cy.contains('nieuwe gebruiker').click()
    // check if stats are present
    cy.contains('Prestaties').should('be.visible')
    cy.contains('Bekijk het aantal gepresteerde uren per maand.').should('be.visible')
    cy.get('#year').should('have.value', 2023)
  })

  it('check the profitability statistics building', () => {
    // go to building overview
    cy.get('#buildings').click()
    // click building
    cy.contains('Building 1').click()
    // it can take a while to load all the schedules
    cy.wait(10000)
    // check if stats are present
    cy.contains('Prestaties').should('be.visible')
    cy.contains('Bekijk het aantal gepresteerde uren per maand.').should('be.visible')
    cy.get('#year').should('have.value', 2023)
  })

  it('add garbage schedule to a building', () => {
    cy.get('#buildings').click()
    // select building
    cy.contains('Building 1').click()
    // it can take a while to load all the schedules
    cy.wait(10000)
    // add garbage
    cy.get('#addgarbage').click()
    cy.get('#action').type('buiten zetten')
    cy.get('#frequency').parent().click()
    cy.contains('wekelijks').click()
    cy.get('#startdate').type('2023-05-22')
    cy.get('#enddate').type('2023-06-22')
    cy.get('#starttime').type('20:00')
    cy.get('#addtoschedule').click()
    cy.get('#schedule').click()
    // check if schedule is added
    cy.get('#buildings').click()
    cy.contains('Building 1').click()
    // it can take a while to load all the schedules
    cy.wait(10000)
    cy.contains('buiten zetten')
    // onder Taken bij het gebouw, of nee toch niet, dus waar kan je dit zien? wss zo bij het aanmaken van een ronde
  })

  it('delete garbage schedule of a building', () => {
    cy.get('#buildings').click()
    // it can take a while to load all the schedules
    cy.wait(10000)
    // select building
    cy.contains('test building').click()
    cy.get('#addgarbage').click()
    cy.contains('Voorlopig schema').click()
    // remove first task
    cy.get('#remove').click()
    //edit garbage
  })

  // editing garbage schedule is just deleting the old one and creating a new one,
  // so no need to test add and delete again

  it('delete building', () => {
    cy.contains('Building 1').click()
    // it can take a while to load all the schedules
    cy.wait(10000)
    // delete
    cy.get('#delete').click()
    cy.contains('Dit gebouw is verwijderd.').should('be.visible')
    cy.get('#buildings').click()
    cy.contains('Building 1').should('not.exist')
  })

  it('add new template', () => {
    // go to template list
    cy.get('#templates').click()
    // click add button
    cy.get('#addtemplate').click()
    // fill in the fields
    cy.get('#templatename').type('test template')
    cy.get('#subject').type('test the templates')
    cy.get('#templatebody').type('This is a test template and should not be used for real emails/messages!')
    // save
    cy.get('#savetemplate').click()
    // check if template is in the list
    cy.get('#templates').click()
    cy.contains('test template')
  })

  it('edit template', () => {
    cy.get('#templates').click()
    cy.get(':nth-child(4) > :nth-child(2) > .v-btn').click()
    cy.get('#templatename').clear()
    cy.get('#templatename').type('new template')
    cy.get('#subject').type('.')
    cy.get('#templatebody').type('Delete this template.')
    // save
    cy.get('#savetemplate').click()
    // check if template is in the list
    cy.get('#templates').click()
    cy.contains('new template')

  })

  it.only('delete templete', () => {
    cy.get('#templates').click()
    cy.get(':nth-child(4) > :nth-child(3) > .v-btn').click()
    cy.contains('new template').should('not.exist')
  })

})
