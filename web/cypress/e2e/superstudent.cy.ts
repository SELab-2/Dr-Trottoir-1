describe('superstudent tests', () => {
  // TODO check if select(...) works better with index
  beforeEach(() => {
    cy.login('superstudent@trottoir.be', 'super_student')
    cy.visit('/ronde/overzicht')
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
    // save
    cy.get('#createround').click()
    // confirm?
    // this gives QueryError2
    // check for popup on screen?
  })

  it('create round, no buildings', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press create button
    cy.get('#newround').click()
    // add name
    cy.get('#roundname').type("test round")
    // save
    cy.get('#createround').click()
    // confirm?
    // this gives QueryError2
    // check for popup on screen?
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
    cy.contains('Round 1').click()
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
    cy.get('#selectstudent').select('Dirk De Student') // maybe safer with index
    cy.get('.selectors').then( () => {
      cy.get('#frequency').select('wekelijks') // maybe safer with index
      cy.get('#startdate').type('01062023')
      cy.get('#enddate').type('31062023')
      cy.get('#starttime').type('1930')
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

  })

  it('delete round', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press on the round you wish to delete
    cy.contains('test round').click()
    // press delete button
    cy.get('#deleteround').click()
    // confirm?
    // round should not be present in the table
    cy.contains('test round').should('not.exist')
  })


  it('observe students currently doing a round', () => {
    // make sure there is a student currently doing Round X: maybe add a test that creates this?
    // give round to student -> student starts round
    const round: string = "Ronde 3"
    // go to the overview page
    cy.visit('/ronde/overzicht')
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
