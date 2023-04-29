describe('syndicus tests', () => {
  beforeEach(() => {
    cy.login('syndicus@trottoir.be', 'syndicus')
  })

  it('check building', () => {
    // syndicus checks for comments left on one of their buildings
  })

  it('add building', () => {
    // press create button
    // add building data
    // save
  })

  it('edit building', () => {
    // press building from buildings overview (right now a bit unclear as to how to do this, with the v-for element)
    // press edit button
    // alter building data
    // save
  })

})
