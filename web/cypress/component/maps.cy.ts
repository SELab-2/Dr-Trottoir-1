import Map from '@/components/maps/MapComponent.vue'

describe("map tests", () => {
  it('mapcomponent test', () => {
    cy.mount(Map, {
      props: {
        buildings: [
          {
            name: "house",
            id: 1,
            address: {
              latitude: 51.2,
              longitude: 4.2,
            }
          },{
            name: "appartement",
            id: 3,
            address: {
              latitude: 51,
              longitude: 4.3,
            }
          },{
            name: "villa",
            id: 2,
            address: {
              latitude: 50.9,
              longitude: 3.9,
            }
          }
        ]
      }
    })
    cy.contains('1. house')
    cy.contains('2. appartement')
    cy.contains('3. villa')
  })
})
