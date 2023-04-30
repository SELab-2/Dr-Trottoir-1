import BuildingCard from '@/components/building/BuildingCard.vue'
import GarbageSchedule from '@/components/building/GarbageSchedule.vue'

describe("building component test", () => {
  it('buildingcard test', () => {
    cy.mount(BuildingCard, {
      props: {
        building: {id: 6, name: "testgebouw", address:{street: "teststraat", number: 5, zip_code: 9000, city: "Gent"}}
      },
    })
    // can't really click on it, as there is no active router to perform router.push(...)
  })

  it('garbageschedule test', ()=>{
    cy.mount(GarbageSchedule, {
      props: {
        schedule: [{id: 6, user: {first_name: "test", last_name: "user"}}, {
          id: 7,
          user: {first_name: "one", last_name: "two"}
        }]
      }
    })
    // not exactly correct
  })
})
