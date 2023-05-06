import BuildingCard from '@/components/building/BuildingCard.vue'
import GarbageSchedule from '@/components/building/GarbageSchedule.vue'

describe("building component test", () => {
  it('buildingcard test', () => {
    cy.mount(BuildingCard, {
      props: {
        building: {id: 6, name: "testgebouw", address: {street: "teststraat", number: 5, zip_code: 9000, city: "Gent"}}
      },
    })
    // all info present
    cy.contains("testgebouw").should('be.visible')
    cy.contains("teststraat 5").should('be.visible')
    cy.contains("9000 Gent").should('be.visible')
    // can't really click on the card, as there is no active router to perform router.push(...)
  })
})
