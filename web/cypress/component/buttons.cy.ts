import RoundedButton from '@/components/buttons/RoundedButton.vue'
import AddButton from '@/components/buttons/AddButton.vue'
import Button from '@/components/models/Button.vue';

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
        items: [<Button>{title: "test1"}, <Button>{title: "test2"}]
      },
    })
    cy.contains("test1").should('not.exist')
    cy.contains("test2").should('not.exist')
    cy.get('#menu-activator').click()
    cy.contains("test1").should('be.visible')
    cy.contains("test2").should('be.visible')
    cy.get('#menu-activator').click()
    cy.contains("test1").should('not.be.visible')
    cy.contains("test2").should('not.be.visible')
  })
})
