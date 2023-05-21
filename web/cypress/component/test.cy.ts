import AddButton from '../../src/components/buttons/AddButton.vue'

describe("test", () => {

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
