import SyndicusButtons from '@/components/building/SyndicusButtons.vue'

describe("building component test", () => {
  it('buildingcard test', () => {
    cy.mount(SyndicusButtons, {
      props: {
        phone: "0123456789",
        email: "test@test.com",
        clickPhone: () => {} ,
        clickEmail: () => {},
      }
    })
    // all info present
    cy.contains("0123456789").should('be.visible')
    cy.contains("E-mail").should('be.visible')
  })
})
