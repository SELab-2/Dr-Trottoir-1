import RoundedInfoChip from '@/components/chips/RoundedInfoChip.vue'

describe('chips tests', () => {
  it('roundedinfochip test', () => {
    cy.mount(RoundedInfoChip, {
      props: {
        icon: "mdi-pencil",
        text: "test",
      }
    })
    cy.contains("test").should('be.visible')
  })
});
