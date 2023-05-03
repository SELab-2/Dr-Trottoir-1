import BuildingCard from '@/components/building/BuildingCard.vue'
import GarbageSchedule from '@/components/building/GarbageSchedule.vue'

describe("building component test", () => {
  it('buildingcard test', () => {
    cy.mount(BuildingCard, {
      props: {
        building: {id: 6, name: "testgebouw", address: {street: "teststraat", number: 5, zip_code: 9000, city: "Gent"}}
      },
    })
    cy.contains("testgebouw")
    cy.contains("teststraat 5")
    cy.contains("9000 Gent")
    // can't really click on it, as there is no active router to perform router.push(...)
  })

  it('garbageschedule test', () => {
    cy.mount(GarbageSchedule, {})
    cy.contains('Kalender')
    cy.contains("Taken")
    cy.contains('Studentbezoeken')
    cy.get('#calendar')
    // calendar is found but is not actually visible
    // why is there a random f?
    // can't really test since the data comes from queries, not props
  })
})
