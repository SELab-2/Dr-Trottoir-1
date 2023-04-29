import BuildingCard from '@/components/cards/BuildingCard.vue'
import BuildingInfoCard from '@/components/cards/BuildingInfoCard.vue'
import BuildingSelectCard from '@/components/cards/BuildingSelectCard.vue'
import ImageCard from '@/components/cards/ImageCard.vue'

describe("card tests", () => {
  it('buildingcard test', () => {
    cy.mount(BuildingCard, {
      props: {
        building: {id: 6, name: "testgebouw", address:{street: "teststraat", number: 5, zip_code: 9000, city: "Gent"},
        syndicus: {user: {first_name: "test", last_name: "gebruiker"}}},
        start_date: new Date(),
        end_date: new Date(),
      },
    })
    cy.contains('testgebouw')
    cy.contains('test gebruiker')
    cy.contains('teststraat 5 Gent')
  })

  it('buildinginfocard test', () => {
    cy.mount(BuildingInfoCard, {
      props: {
        name: "testgebouw",
        address: "teststraat 1",
        id: "1",
      },
    })
    cy.contains('testgebouw')
    cy.contains('teststraat 1')
  })

  it('buildingselectcard test', () => {
    cy.mount(BuildingSelectCard, {
      props: {
        name: "testgebouw",
        address: "teststraat 1",
        buildingId: 1,
        garbageinfo: true,
      },
    })
    cy.contains('testgebouw')
    cy.contains('teststraat 1')
  })

  it('imagecard test', () => {
    cy.mount(ImageCard, {
      props: {
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/1200px-Grosser_Panda.JPG",
        title: "test image",
        titleIcon: "mdi-domain",
        text: "text",
        textIcon: "mdi-domain",
        btnIcon: "mdi-domain",
        btnText: "button",
      },
    })
    // TODO title and text don't display
    // cy.contains('text')
    cy.contains('button')
  })


})
