describe('admin tests', () => {
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
    cy.get('#submit').click()
    // check if user in userlist
    cy.contains('test naam')
    // click on user and check if all fields are ok? or is this more for backend testing?
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
    cy.contains('nieuwe gebruiker')
  })

  it('delete a user', () => {
    // go to user overview
    cy.get('#users').click()
    // click user
    cy.contains('nieuwe gebruiker').click()
    // press edit button
    cy.get('#edit').click()
    // press delete
    cy.get('#delete').click()
    // press confirm
    cy.get('#submit').click()
    // user should not be present in the table
    // cy.get('#users').click()
    cy.contains('nieuwe gebruiker').should('not.exist')
  })

  it('check the profitability statistics', () => {
    // not yet implemented
  })

  it('add building', () => {
    cy.get('#buildings').click()
    // press create button
    cy.get('#newbuilding').click()
    // add building data
    cy.get('#name').type('test building')
    cy.get('#ivagoid').type('1234')
    // syndicus still hardcoded
    // cy.get('#syndicus').select()
    cy.get('#longitude').type("12")
    cy.get('#latitude').type("34")
    cy.get('#addressform').then(() => {
      cy.get('#street').type("teststreet")
      cy.get('#streetnr').type("1")
      cy.get('#city').type("test")
      cy.get('#zipcode').type("1111")
    })
    cy.get('#submit').click()
    // save
    // we should be on the info page of the building
    cy.contains('test building')
    cy.contains('Taken')
    cy.contains('Bezoeken')
    // cy.contains('1234') ivago id not shown
    // cy.contains('name of syndicus')
    // maybe click on the 'kaarten' button to see if address was added correctly
  })

  it('add garbage schedule to a building', () => {
    cy.get('#buildings').click()
    // select building
    cy.contains('Building 1').click()
    // add garbage
    cy.get('#addgarbage').click()
    cy.get('#garbage').select('REST')
    cy.get('#action').select('buiten zetten')
    cy.get('frequency').select('wekelijks')
    // TODO: add an actual date
    cy.get('startdate').type('')
    cy.get('#enddate').type('')
    cy.get('time').type('2000')
    cy.get('#addtoschedule').click()
    cy.get('#schedule').click()
    // check if schedule is added
    cy.get('#buildings').click()
    cy.contains('Building 1').click()
    // onder Taken bij het gebouw, of nee toch niet, dus waar kan je dit zien? wss zo bij het aanmaken van een ronde
  })

  it('edit garbage schedule of a building', () => {
    cy.get('#buildings').click()
    // select building
    cy.contains('test building').click()
    //edit garbage
  })

  it('delete garbage schedule of a building', () => {
    cy.get('#buildings').click()
    // select building
    cy.contains('test building').click()
    // delete garbage
  })

  it('edit building', () => {
    cy.get('#buildings').click()
    // press building from buildings overview
    cy.contains('test building').click()
    // press edit button
    cy.contains('#edit').click()
    // alter building data
    cy.get('#name').clear().type('test gebouw')
    cy.get('#ivagoid').clear().type('4321')
    // syndicus still hardcoded
    // cy.get('#syndicus').select()
    cy.get('#longitude').clear().type("21")
    cy.get('#latitude').clear().type("43")
    cy.get('#addressform').then(() => {
      cy.get('#street').clear().type("teststraat")
      cy.get('#streetnr').clear().type("10")
      cy.get('#city').clear().type("city")
      cy.get('#zipcode').clear().type("1000")
    })
    cy.get('#submit').click()
    // save
    // we should be on the info page of the building
    cy.contains('test gebouw')
    cy.contains('Taken')
    cy.contains('Bezoeken')
    // cy.contains('4321') ivago id not shown
    // cy.contains('name of syndicus')
    // maybe click on the 'kaarten' button to see if address was added correctly
  })

  it('delete building', () => {
    cy.contains('test building').click()
    cy.get('#edit').click()
    // deletion not yet implemented
    // delete
    // confirm?
  })

})
