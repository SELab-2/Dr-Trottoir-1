import RoundedButton from '@/components/buttons/RoundedButton.vue'
import AddButton from '@/components/buttons/AddButton.vue'

describe("buttons test", () => {
  it('roundedbutton test', () => {
    cy.mount(RoundedButton, {
      props: {
        icon: 'mdi-domain',
        value: 'Click me!',
      },
    })
    cy.get('#button').should('contains.text', 'Click me!')
  })

  it('addbutton test', () => {
    cy.mount(AddButton, {
      props: {
        icon: 'mdi-domain',
        items: []
      },
    })
    // TODO add buttons in items list
    cy.get('#menu-activator').click()
  })
})
