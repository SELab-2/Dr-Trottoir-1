import RoundDetailCard from '@/components/round/RoundDetailCard.vue'
import RoundCard from '@/components/round/RoundCard.vue'

describe("round tests", () => {
  describe('roundcard tests', () => {
    it('roundcard completed', () => {
      cy.mount(RoundCard, {
        props: {
          schedule: {
            id: 1,
            day: new Date(),
            user_id: 2,
            user: {
              first_name: "test",
              last_name: "gebruiker"
            },
            round_id: 3,
            progress: [],
          },
          status: "completed",
          comments: true,
          images: 3,
        }
      })
      // all info present
      cy.contains((new Date()).toLocaleDateString()).should('be.visible')
      cy.contains("test gebruiker").should('be.visible')
      cy.contains("Opmerkingen").should('be.visible')
      cy.get('#images').contains('3').should('be.visible')
    })

    it('roundcard active', () => {
      cy.mount(RoundCard, {
        props: {
          schedule: {
            id: 1,
            day: new Date(),
            user_id: 2,
            user: {
              first_name: "test",
              last_name: "gebruiker"
            },
            round_id: 3,
            progress: [],
          },
          status: "active",
          comments: false,
          images: 4,
        }
      })
      // all info present
      cy.contains('Actief').should('be.visible')
      cy.contains((new Date()).toLocaleDateString()).should('be.visible')
      cy.contains("test gebruiker").should('be.visible')
      cy.contains("Opmerkingen").should('not.exist')
      cy.get('#images').contains('4').should('be.visible')
    })

    it('roundcard scheduled', () => {
      cy.mount(RoundCard, {
        props: {
          schedule: {
            id: 1,
            day: new Date(),
            user_id: 2,
            user: {
              first_name: "test",
              last_name: "gebruiker"
            },
            round_id: 3,
            progress: [],
          },
          status: "scheduled",
          comments: false,
          images: 0,
        }
      })
      // all info present
      cy.contains('Actief').should('not.exist')
      cy.contains((new Date()).toLocaleDateString()).should('be.visible')
      cy.contains('Opmerkingen').should('not.exist')
      cy.get('#images').should('not.exist')
    })
  })
})
