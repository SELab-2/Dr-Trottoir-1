import Avatar from '@/components/Avatar.vue'
import Badge from '@/components/Badge.vue'
import PhotoButton from '@/components/PhotoButton.vue'


describe("component tests", () => {
  it('avatar test', () => {
    cy.mount(Avatar, {
      props: {
        name: "test gebruiker",
        size: "small",
      },
    })
    cy.contains('tg')
  })

  it('badge test', () => {
    cy.mount(Badge, {
      props: {
        value: 10,
      },
    })
    cy.contains('10')
  })

  it('photobutton test', () => {
    cy.mount(PhotoButton, {})
    cy.contains("File input")
    cy.get("#input").selectFile('src/assets/images/drtroittoir_logo.png')
    cy.contains("drtroittoir_logo.png")
  })

})
