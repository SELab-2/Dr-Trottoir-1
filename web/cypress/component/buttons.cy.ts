import RoundedButton from '@/components/buttons/RoundedButton.vue'
import AddButton from '@/components/buttons/AddButton.vue'

describe("buttons test", () => {
  it('roundedbutton', () => {
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
