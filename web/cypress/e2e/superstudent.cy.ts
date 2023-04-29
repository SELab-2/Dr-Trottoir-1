describe('superstudent tests', () => {
  // TODO check if cy.contains('X') works instead of cy.get(..).get(...).contains('X')
  // TODO check if select(...) works better with index
  // TODO get('CustomComponent') will probably fail => find solution
  beforeEach(() => {
    cy.login('superstudent@trottoir.be', 'super_student')
    cy.visit('/ronde/overzicht')
  })

  // there is a lot of overlap for superstudents and admins,
  // these overlaps will be tested with either a superstudent or an admin. There is no need to test them twice.

  it('create round', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press create button
    cy.get('#newround').click()
    // add buildings
    cy.get('#building').eq(0).click() // not sure if this actually works yet
    cy.get('#building').eq(0).click()
    // add name
    cy.get('#roundname').type("test round")
    // save
    cy.get('#createround').click()
    // confirm?
    // we are rerouted back to the rounds table
    cy.contains("test round")
  })

  it('edit round', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press on the round you wish to change
    cy.get('#roundtable').get('#table').contains('td', 'Round 1').click()
    // maybe even cy.contains('td', 'Round 1').click() will work
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
    cy.get('#roundtable').get('#table').contains('td', 'test round').click()
    // select plan schedule
    cy.get('#schedule').click()
    // select student and date(s)
    cy.get('#selectstudent').select('Dirk De Student') // maybe safer with index
    cy.get('.selectors').then( () => {
      cy.get('#frequency').select('wekelijks') // maybe safer with index
      cy.get('#startdate').type('01052023')
      cy.get('#enddate').type('31052023')
      cy.get('#starttime').type('1930')
    })
    // add
    cy.get('#addschedule').click()
    // save
    cy.get('#planschedule').click()
    // confirm?
    //check if schedule has been added
    cy.get('#rounds').click()
    cy.get('#roundtable').get('#table').contains('td', 'test round').click()
    cy.get('RoundCard').contains("h3", new Date("2023-05-01").toLocaleDateString())
    // I don't know if this will work, maybe just cy.contains("h3", new Date("2023-05-01").toLocaleDateString())
  })

  it('switch student for round (for a single date)', () => {

  })

  it('delete round', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press on the round you wish to delete
    cy.get('#roundtable').get('#table').contains('td', 'test round').click()
    // press delete button
    cy.get('#deleteround').click()
    // confirm?
    // round should not be present in the table
    cy.get('#roundtable').get('#table').contains('td', 'test round').should('not.exist')
  })


  it('observe students currently doing a round', () => {
    // make sure there is a student currently doing Round X: maybe add a test that creates this?
    const round: string = "Round X"
    // go to the overview page
    cy.visit('/ronde/overzicht')
    // add filters
    cy.get('#filter').then(() => {
      cy.get('#showfilters').click()
      // select filters
      cy.get('#searchtype').type(round)
    })
    // click on the student/round to get more details
    cy.get('RoundCard').first().click()
    cy.contains(round)
  })

})
