import AddImage from '@/components/images/AddImage.vue'
import MultiAddImage from '@/components/images/MultiAddImage.vue'
import PhotoMaker from '@/components/images/PhotoMaker.vue'

describe("images tests", () => {
  it('addimage id!=0 test', () => {
    cy.mount(AddImage, {
      props:{
        id: 1
      }
    })
    cy.contains('Commentaar')
    cy.get('#comment').should('have.value', '')
    cy.get('#comment').type('New Comment')
    cy.get('#comment').should('have.value', 'New Comment')
    cy.contains('Verwijder afbeelding').should('be.visible')
    cy.get("#input").selectFile('src/assets/images/drtroittoir_logo.png')
  })
  it('addimage id==0 test', () => {
    cy.mount(AddImage, {
      props:{
        id: 0
      }
    })
    cy.contains('Commentaar')
    cy.contains('Verwijder afbeelding').should('not.be.visible')
    // Verwijder afbeelding should appear on the screen when adding new image
    // cy.get("#input").selectFile('src/assets/images/drtroittoir_logo.png')
    // y.contains('Verwijder afbeelding').should('be.visible')
  })

  it('multiaddimage test', () => {
    cy.mount(MultiAddImage, {})
    cy.contains('afbeelding toevoegen').click()
    // check if an extra image field was added
    cy.get('button:contains("Verwijder afbeelding")').should('have.length', 2);
  })

  it.only('photomaker test', () => {
    cy.mount(PhotoMaker, {})
    cy.contains("Maak foto")
    cy.contains("Selecteer afbeelding")
    cy.contains("Commentaar")
    cy.contains("Foto label")
    cy.get('#comment').should('have.value', '')
    cy.get('#comment').type('New Comment')
    cy.get('#comment').should('have.value', 'New Comment')
    cy.get('#label').should('have.value', '')
    cy.get('#label').type('New Label')
    cy.get('#label').should('have.value', 'New Label')
    cy.get("#select").selectFile('src/assets/images/drtroittoir_logo.png')
  })

})
