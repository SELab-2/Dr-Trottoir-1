describe('superstudent tests', () => {
  beforeEach(() => {
    cy.login('superstudent@trottoir.be', 'super_student')
  })

  // there is a lot of overlap for superstudents and admins,
  // these overlaps will be tested with either a superstudent or an admin. There is no need to test them twice.

  it('create round', () => {
    // go to round overview?
    // press create button
    // add buildings
    // add name
    // save
  })

  it('edit round', () => {
    // go to round overview
    cy.visit('/ronde')
    // press on the round you wish to change
    // add buildings
    // add name
    // save
  })

  it('give a round to a student', () => {
    // go to the dedicated page
    // select round
    // select student
    // save
  })

  it('observe students currently doing a round', () => {
    // go to the overview page
    cy.visit('/ronde/overzicht')
    // click on the student/round to get more details
  })

})
