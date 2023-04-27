import RoundedButton from '../../src/components/buttons/RoundedButton.vue'
import AddButton from '../../src/components/buttons/AddButton.vue'
import BuildingCard from '../../src/components/building/BuildingCard'

describe("test", () => {
  it('uses custom text for the button label', () => {
    cy.mount(RoundedButton, {
      props: {
        icon: 'mdi-domain',
        value: 'Click me!',
      },
    })
    cy.get('#button').should('contains.text', 'Click me!')
  })

  it('addbutton', () => {
    cy.mount(AddButton, {
      props: {
        icon: 'mdi-domain',
        items: []
      },
    })
    cy.get('#menu-activator').click()
  })

  it('buildingcard', () => {
    cy.mount(BuildingCard, {
      props: {
        building: {id: 6, name: "testgebouw", address:{street: "teststraat", number: 5, zip_code: 9000, city: "Gent"}}
      },
    })
    // can't really click on it, as there is no active router to perform router.push(...)
  })
})
