import PhotoMaker from '@/components/images/PhotoMaker.vue'

describe("images tests", () => {
  it('photomaker test', () => {
    cy.mount(PhotoMaker, {
      id: "test",
      isPhoto: true,
      currentComments: "This is a comment",
    })
    // all info present, you can add comments and labels and select a file
    cy.contains("Foto toevoegen").should('be.visible')
    cy.contains("Selecteer afbeelding").should('be.visible')
    cy.contains("Commentaar").should('be.visible')
    cy.get('#comment').should('have.value', '')
    cy.get('#comment').type('New Comment')
    cy.get('#comment').should('have.value', 'New Comment')
    cy.get('#type').should('have.value', 'ARRIVAL')
    cy.get('#type').parent().click()
    cy.contains('DEPARTURE').click()
    cy.get('#type').should('have.value', 'DEPARTURE')
    cy.get("#select").selectFile('src/assets/images/drtroittoir_logo.png')
    cy.contains("drtroittoir_logo.png").should('be.visible')
    cy.get("#save").should('be.visible')
  })

})
