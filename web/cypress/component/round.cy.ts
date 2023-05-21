import RoundCard from '@/components/round/RoundCard.vue'

describe("round tests", () => {
  it('roundcard test', () => {
    cy.mount(RoundCard, {
      props: {
        schedule: {
          id: 1,
          day: new Date(),
          user: {
            first_name: "test",
            last_name: "gebruiker"
          },
          round_id: 3
        },
      }
    })
    // all info present
    // the actual progress of the round is fetched using the api
    cy.contains((new Date()).toLocaleDateString()).should('be.visible')
    cy.contains("test gebruiker").should('be.visible')
  })
})
