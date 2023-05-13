import RoundDetailCard from '@/components/round/RoundDetailCard.vue'
import RoundCard from '@/components/round/RoundCard.vue'

describe("round tests", () => {
  describe('RoundDetailCard tests', () => {
    // TODO
    it('delete this test once others work', () => {
      cy.mount(RoundDetailCard, {
        props:{
          entry: {
            progress: {
                id: 1,
                report: "test",
                arrival: new Date(),
                departure: new Date(),
                building_id: 2,
                building: {
                  id: 2,
                  name: "testbuilding",
                  syndicus_id: 3,
                  syndicus: {},
                  address_id: 4,
                  address: {
                    id: 4,
                    street: 'teststraat',
                    number: 1, city: "Gent",
                    zip_code: 9000,
                  }
                },
                schedule_id: 5,
                schedule: {},
                images: [
                  {
                    id: 1,
                    type: "arrival",
                    description: "test arrival"
                  },
                  {
                    id: 2,
                    type: "departure",
                    description: "test departure"
                  }
                ]
              },
            building: {
              id: 2,
              name: "testbuilding",
              syndicus_id: 3,
              syndicus: {},
              address_id: 4,
              address: {
                id: 4,
                street: 'teststraat',
                number: 1,
                city: "Gent",
                zip_code: 9000,
              }
            },
          }
        }
      })
    })

    it('RoundDetailCard test with images', () => {
      cy.mount(RoundDetailCard, {
        props: {
          progress: {
              id: 1,
              report: "test",
              arrival: new Date(),
              departure: new Date(),
              building_id: 2,
              building: {
                id: 2,
                name: "testbuilding",
                syndicus_id: 3,
                syndicus: {},
                address_id: 4,
                address: {
                  id: 4,
                  street: 'teststraat',
                  number: 1, city: "Gent",
                  zip_code: 9000,
                }
              },
              schedule_id: 5,
              schedule: {},
              images: [
                {
                id: 1,
                type: "arrival",
                description: "test arrival"
                },
                {
                id: 2,
                type: "departure",
                description: "test departure"
                }
              ]
            },
          building: {
            id: 2,
            name: "testbuilding",
            syndicus_id: 3,
            syndicus: {},
            address_id: 4,
            address: {
              id: 4,
              street: 'teststraat',
              number: 1,
              city: "Gent",
              zip_code: 9000,
            }
          },
        }
      })
      // all info present, all pictures present and you can edit a note
      cy.contains('testbuilding').should('be.visible')
      cy.contains('teststraat 1').should('be.visible')
      cy.contains('9000 Gent').should('be.visible')
      cy.contains('Notities').should('be.visible')
      cy.contains('test').should('be.visible')
      cy.contains('Bewerken').should('be.visible')
      cy.contains('Afbeeldingen').should('be.visible')
      cy.contains('Toevoegen').should('be.visible')
      cy.contains('arrival').should('be.visible')
      cy.contains('test arrival').should('be.visible')
      cy.contains('departure').should('be.visible')
      cy.contains('test departure').should('be.visible')
      cy.get('#edit').click()
      cy.get('#notes').clear().type("NOTE")
      cy.get('#save').click()
      // savebutton uses api call to update the database, so this can't be tested with just a component test
      // same for the add image button
    })
    it('RoundDetailCard test no images', () => {
      cy.mount(RoundDetailCard, {
        props: {
          progress: {
              id: 1,
              report: "test",
              arrival: new Date(),
              departure: new Date(),
              building_id: 2,
              building: {
                id: 2,
                name: "testbuilding",
                syndicus_id: 3,
                syndicus: {},
                address_id: 4,
                address: {
                  id: 4,
                  street: 'teststraat',
                  number: 1,
                  city: "Gent",
                  zip_code: 9000,
                }
              },
              schedule_id: 5,
              schedule: {},
              images: []
            },
          building: {
            id: 2,
            name: "testbuilding",
            syndicus_id: 3,
            syndicus: {},
            address_id: 4,
            address: {
              id: 4,
              street: 'teststraat',
              number: 1,
              city: "Gent",
              zip_code: 9000,
            }
          },
        }
      })
      // all info present, no pictures and you can edit a note
      cy.contains('testbuilding').should('be.visible')
      cy.contains('teststraat 1').should('be.visible')
      cy.contains('9000 Gent').should('be.visible')
      cy.contains('Notities').should('be.visible')
      cy.contains('test').should('be.visible')
      cy.contains('Bewerken').should('be.visible')
      cy.contains('Afbeeldingen').should('be.visible')
      cy.contains('Geen foto\'s toegevoegd.').should('be.visible')
      cy.contains('Toevoegen').should('be.visible')
      cy.get('#edit').click()
      cy.get('#notes').clear().type("NOTE")
      cy.get('#save').click()
    })
  })

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
