import Progress from '@/components/round/Progress.vue'
import RoundCard from '@/components/round/RoundCard.vue'

describe("round tests", () => {
  describe('progress tests', () => {
    it('progress test with images', () => {
      cy.mount(Progress, {
        props: {
          progress:
            {
              id: 1, report: "test", arrival: new Date(), departure: new Date(), building_id: 2,
              building: {
                id: 2, name: "testbuilding", syndicus_id: 3, syndicus: {}, address_id: 4,
                address: {
                  id: 4, street: 'teststraat', number: 1, city: "Gent", zip_code: 9000,
                }
              },
              schedule_id: 5, schedule: {},
              images: [{
                id: 1,
                type: "arrival",
                description: "test arrival"
              }, {
                id: 2,
                type: "departure",
                description: "test departure"
              }]
            },
          building: {
            id: 2, name: "testbuilding", syndicus_id: 3, syndicus: {}, address_id: 4,
            address: {
              id: 4, street: 'teststraat', number: 1, city: "Gent", zip_code: 9000,
            }
          },
        }
      })
      cy.contains('testbuilding')
      cy.contains('teststraat 1')
      cy.contains('9000 Gent')
      cy.contains('Notities')
      cy.contains('test')
      cy.contains('Bewerken')
      cy.contains('Afbeeldingen')
      cy.contains('Toevoegen')
      cy.contains('arrival')
      cy.contains('test arrival')
      cy.contains('departure')
      cy.contains('test departure')
      cy.get('#edit').click()
      cy.get('#notes').clear().type("NOTE")
      cy.get('#save').click()
      // savebutton uses api call to update the database, so this can't be tested with just a component test
      // same for the add image button
    })
    it('progress test no images', () => {
      cy.mount(Progress, {
        props: {
          progress:
            {
              id: 1, report: "test", arrival: new Date(), departure: new Date(), building_id: 2,
              building: {
                id: 2, name: "testbuilding", syndicus_id: 3, syndicus: {}, address_id: 4,
                address: {
                  id: 4, street: 'teststraat', number: 1, city: "Gent", zip_code: 9000,
                }
              },
              schedule_id: 5, schedule: {},
              images: []
            },
          building: {
            id: 2, name: "testbuilding", syndicus_id: 3, syndicus: {}, address_id: 4,
            address: {
              id: 4, street: 'teststraat', number: 1, city: "Gent", zip_code: 9000,
            }
          },
        }
      })
      cy.contains('Geen foto\'s toegevoegd.')
    })
  })
  describe.only('roundcard tests', () => {
    it('roundcard completed', () => {
      cy.mount(RoundCard, {
        props: {
          schedule: {
            id: 1, day: new Date(), user_id: 2,
            user:{first_name: "test", last_name: "gebruiker"},
            round_id: 3, progress: []
          },
          status: "completed",
        }
      })
      cy.contains((new Date()).toLocaleDateString())
      cy.contains("test gebruiker")
      cy.contains("Opmerkingen") // this is hardcoded with a random chance, so will sometimes fail
      cy.contains('10') // this is still a hardcoded number for now
    })

      it('roundcard active', () => {
      cy.mount(RoundCard, {
        props: {
          schedule: {
            id: 1, day: new Date(), user_id: 2,
            user:{first_name: "test", last_name: "gebruiker"},
            round_id: 3, progress: []
          },
          status: "active",
        }
      })
      cy.contains('Actief')
    })

    it('roundcard scheduled', () => {
      cy.mount(RoundCard, {
        props: {
          schedule: {
            id: 1, day: new Date(), user_id: 2,
            user:{first_name: "test", last_name: "gebruiker"},
            round_id: 3, progress: []
          },
          status: "scheduled",
        }
      })
      cy.contains('Actief').should('not.exist')
      cy.contains('Opmerkingen').should('not.exist')
      cy.contains('10').should('not.exist')
    })
  })
})
