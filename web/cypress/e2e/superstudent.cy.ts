describe('superstudent tests', () => {
  // TODO check if select(...) works better with index
  beforeEach(() => {
    //cy.login('superstudent@trottoir.be', 'super_student')
    //cy.visit('/ronde/overzicht')
    cy.visit('/')
    cy.get('#email').type('superstudent@trottoir.be')
    cy.get('#password').type('super_student')
    cy.get('#login').click()

  })

  // there is a lot of overlap for superstudents and admins,
  // these overlaps will be tested with either a superstudent or an admin. There is no need to test them twice.

  it('create round, no name', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press create button
    cy.get('#newround').click()
    // add buildings
    cy.get('#building').first().click()
    cy.get('#building').first().click()
    cy.get('#description').type("This is the description for the test round.")
    // save
    cy.get('#createround').click()
    // check for popup on screen
    cy.contains("400 - Error").should('be.visible')
  })

  it('create round, no buildings', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press create button
    cy.get('#newround').click()
    // add name
    cy.get('#roundname').type("test round")
    cy.get('#description').type("This is the description for the test round.")
    // save
    cy.get('#createround').click()
    // check for popup on screen
    // cy.contains("400 - Error").should('be.visible')
    // this creates a round with 0 buildings, no error
  })

  it('create round succes', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press create button
    cy.get('#newround').click()
    // add buildings
    cy.get('#building').first().click()
    cy.get('#building').first().click()
    // add name
    cy.get('#roundname').type("test round")
    cy.get('#description').type("This is the description for the test round.")
    // save
    cy.get('#createround').click()
    // confirm?
    // we are rerouted to the round detail of the new round
    cy.contains("test round")
    cy.contains('Gebouwen')
    // cy.contains('naam gebouw 1')
    cy.contains("Planning")
    // check if it also appears in the list
    cy.get('#rounds').click()
    cy.contains("test round")
  })

  it('edit round', () => {
    // also add tests where try to edit round with incorrect data?

    // go to round overview
    cy.get('#rounds').click()
    // press on the round you wish to change
    cy.contains('test round').click()
    // press edit button

    // edit button currently not implemented

    // add/delete buildings
    // edit name
    // save
    // confirm?
    // check if correct buildings and name are present
  })

  it('give a round to a student', () => {
    // go to round overview
    cy.get('#rounds').click()
    // select round
    cy.contains('test round').click()
    // select plan schedule
    cy.get('#schedule').click()
    // select student and date(s)
    cy.get('#selectstudent').parent().click()
    cy.contains('Dirk De Student').click()
    cy.get('.selectors').then( () => {
      cy.get('#frequency').parent().click()
      cy.contains('wekelijks').click()
      cy.get('#startdate').type('2023-05-22')
      cy.get('#enddate').type('2023-06-30')
      cy.get('#starttime').type('20:30')
    })
    // add
    cy.get('#addschedule').click()
    // save
    cy.get('#planschedule').click()
    // confirm?
    //check if schedule has been added
    cy.get('#rounds').click()
    cy.contains('test round').click()
    // this will work if the last added schedule is the first one in the list
    cy.get('#buildingcard').first().then(() => {
      cy.get('#date').contains(new Date("2023-06-01").toLocaleDateString())
      cy.get('#student').contains("Dirk De Student")
    })
  })

  it('switch student for round (for a single date)', () => {
    // for now, i don't know how
  })

  it('delete round', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press on the round you wish to delete
    //cy.contains('test round').click()
    cy.contains('delete').click()
    // press delete button
    cy.get('#deleteround').click()
    // confirm
    cy.get('#submit').click()
    // round should not be present in the table
    cy.contains('test round').should('not.exist')
    cy.contains('delete').should('not.exist')
  })


  it.only('observe students currently doing a round', () => {
    // make sure there is a student currently doing Round X: maybe add a test that creates this?
    // give round to student -> student starts round
    const round: string = "Round 2"
    // we are at round the follup page
    // add filters
    cy.get('#filter').then(() => {
      cy.get('#showfilters').click()
      // select filters
      cy.get('#searchtype').type(round)
    })
    // click on the student/round to get more details
    cy.get('#roundcard').first().click()
    cy.contains(round)
    // full name wasn't visible in the round selection, but it is once you clicked on the round
    cy.contains("Dirk De Student")
    // gebouw cards uitklappen om opmerkingen/afbeeldingen te zien
  })

})
