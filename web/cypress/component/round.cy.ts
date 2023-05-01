import Progress from '@/components/round/Progress.vue'


describe("round tests", () => {
  it.only('progress test', () => {
    cy.mount(Progress, {
      props: {
        progress:
        {id:1, report:"test", arrival: new Date(), departure: new Date(), building_id: 2,
                   building: {
                     id: 2,name: "testbuilding", syndicus_id: 3, syndicus: {}, address_id: 4,
                     address: {
                       id: 4, street: 'teststraat', number: 1, city: "Gent", zip_code: 9000,
                     }},
                   schedule_id: 5, schedule: {}, images: ["a", "b"]
                 },
        building: {id: 2,name: "testbuilding", syndicus_id: 3, syndicus: {}, address_id: 4,
          address: {
            id: 4, street: 'teststraat', number: 1, city: "Gent", zip_code: 9000,
          }},
        }
    })
  })
})
