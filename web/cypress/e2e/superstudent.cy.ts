describe('superstudent tests', () => {
  beforeEach(() => {
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
    // can't click save
    cy.get('#createround').should('be.disabled')
  })

  it('create round, no buildings', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press create button
    cy.get('#newround').click()
    // add name
    cy.get('#roundname').type("test round")
    cy.get('#description').type("This is the description for the test round.")
    // can't click save
    cy.get('#createround').should('be.disabled')
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
    cy.get('#roundcard').first().then(() => {
      cy.get('#date').contains(new Date("2023-05-22").toLocaleDateString())
      cy.get('#student').contains("Dirk De Student")
    })
  })

  it('switch student for round (for a single date)', () => {
    // go to round overview
    cy.get('#rounds').click()
    // select round
    cy.contains('test round').click()
    // select plan schedule
    cy.get('#schedule').click()
    // go to the already planned tasks
    cy.contains('Voorlopig schema').click()
    // remove first scheduled round
    cy.get('#remove').click()
    // add new one
    cy.contains('Ronde inplannen').click()
    cy.get('#selectstudent').parent().click()
    cy.contains('Dirk De Student').click()
    cy.get('.selectors').then( () => {
      // frequency 'enkel' is standard
      cy.get('#startdate').type('2023-05-22')
      cy.get('#starttime').type('20:30')
    })
    // add
    cy.get('#addschedule').click()
    // save
    cy.get('#planschedule').click()
  })

  it('delete round', () => {
    // go to round overview
    cy.get('#rounds').click()
    // press on the round you wish to delete
    cy.contains('test round').click()
    // press delete button
    cy.get('#deleteround').click()
    // confirm
    cy.get('#submit').click()
    // round should not be present in the table
    cy.contains('test round').should('not.exist')
  })


  it('observe students currently doing a round', () => {
    const round: string = "Round 1"
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
    // expand building cards to view comments and images
    cy.get('#expand').click()
    cy.get('#comments').should('be.visible')
    cy.get('#images').should('be.visible')
  })

})
