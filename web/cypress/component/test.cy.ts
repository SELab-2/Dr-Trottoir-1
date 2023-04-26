import RoundedButton from '../../src/components/buttons/RoundedButton.vue'
import AddButton from '../../src/components/buttons/AddButton.vue'

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
})
