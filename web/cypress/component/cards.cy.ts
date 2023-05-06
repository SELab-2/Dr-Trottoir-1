import BuildingCard from '@/components/cards/BuildingCard.vue'
import BuildingInfoCard from '@/components/cards/BuildingInfoCard.vue'
import BuildingSelectCard from '@/components/cards/BuildingSelectCard.vue'
import ImageCard from '@/components/cards/ImageCard.vue'
import RoundCard from '@/components/cards/RoundCard.vue'
import RoundSelectCard from '@/components/cards/RoundSelectCard.vue'

describe("card tests", () => {
  it('buildingcard test', () => {
    cy.mount(BuildingCard, {
      props: {
        building: {
          id: 6,
          name: "testgebouw",
          address: {
            street: "teststraat",
            number: 5,
            zip_code: 9000,
            city: "Gent"
          },
        syndicus: {
            user: {
              first_name: "test",
              last_name: "gebruiker"
            }
          }
        },
        start_date: new Date(),
        end_date: new Date(),
      },
    })
    // all info present
    cy.contains('testgebouw').should('be.visible')
    cy.contains('test gebruiker').should('be.visible')
    cy.contains('teststraat 5 Gent').should('be.visible')
    cy.contains(((new Date())).toLocaleDateString()).should('be.visible')
  })

  it('buildinginfocard test', () => {
    cy.mount(BuildingInfoCard, {
      props: {
        name: "testgebouw",
        address: "teststraat 1",
        id: "1",
      },
    })
    // all info present
    cy.contains('testgebouw').should('be.visible')
    cy.contains('teststraat 1').should('be.visible')
  })

  it('buildingselectcard show garbage test', () => {
    cy.mount(BuildingSelectCard, {
      props: {
        name: "testgebouw",
        address: "teststraat 1",
        buildingId: 1,
        garbageinfo: true,
      },
    })
    // all info present
    cy.contains('testgebouw').should('be.visible')
    cy.contains('teststraat 1').should('be.visible')
    cy.get('#garbage').should('be.visible')
  })

  it("buildingselectcard don't show garbage test", () => {
    cy.mount(BuildingSelectCard, {
      props: {
        name: "testgebouw",
        address: "teststraat 1",
        buildingId: 1,
        garbageinfo: false,
      },
    })
    // all info present, but no garbage
    cy.contains('testgebouw').should('be.visible')
    cy.contains('teststraat 1').should('be.visible')
    cy.get('#garbage').should('not.be.visible')
  })

  it('imagecard test with image', () => {
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
    // all info present, since there is an image, the title and text should not be visible/exist
    cy.contains('test image').should('not.exist')
    cy.contains('text').should('not.exist')
    cy.contains('button').should('be.visible')
  })

  it('imagecard test without image', () => {
    cy.mount(ImageCard, {
      props: {
        title: "test image",
        titleIcon: "mdi-domain",
        text: "text",
        textIcon: "mdi-domain",
        btnIcon: "mdi-domain",
        btnText: "button",
      },
    })
    // all info present, since there is an image, the title and text should be visible/exist
    cy.contains('test image').should('be.visible')
    cy.contains('text').should('be.visible')
    cy.contains('button').should('be.visible')
  })

  it('roundcard with zero progress', () => {
    const datum: Date = new Date()
    cy.mount(RoundCard, {
      props: {
        round_name: "test round",
        round_start: "startdate or time",
        round_end: "enddate or time",
        student_name: "test student",
        date: datum,
        total_buildings: 5,
        building_index: 0,
        round_comments: true,
      },
    })
    // all info present
    cy.contains('test round').should('be.visible')
    cy.get('#start').should('be.visible')
    cy.get('#end').should('be.visible')
    cy.contains('test student').should('be.visible')
    cy.contains(datum.toLocaleDateString()).should('be.visible')
    cy.contains('5').should('be.visible')
    cy.contains('Niet begonnen').should('be.visible')
  })

  it('roundcard with some progress', () => {
    cy.mount(RoundCard, {
      props: {
        round_name: "test round",
        student_name: "test student",
        date: new Date(),
        total_buildings: 5,
        building_index: 4,
        round_comments: false,
      },
    })
    // all info present
    cy.contains('test round').should('be.visible')
    cy.get('#start').should('not.exist')
    cy.get('#end').should('not.exist')
    cy.contains('test student').should('be.visible')
    cy.contains('5').should('be.visible')
    cy.contains('Bezig 4/5').should('be.visible')
  })

  it('roundcard with full progress', () => {
    cy.mount(RoundCard, {
      props: {
        round_name: "test round",
        round_start: "startdate or time",
        round_end: "enddate or time",
        student_name: "test student",
        date: new Date(),
        total_buildings: 5,
        building_index: 5,
        round_comments: false,
      },
    })
    // all info present
    cy.contains('test round').should('be.visible')
    cy.get('#start').should('be.visible')
    cy.get('#end').should('be.visible')
    cy.contains('test student').should('be.visible')
    cy.contains('5').should('be.visible')
    cy.contains('Klaar').should('be.visible')
  })

  it('roundselectcard test', () => {
    const datum: Date = new Date()
    cy.mount(RoundSelectCard, {
      props: {
        name: 'test round',
        date: datum,
        time: "tijd",
        id: "1",
      },
    })
    // all info present
    cy.contains('test round').should('be.visible')
    cy.contains('tijd').should('be.visible')
    cy.contains(datum.toLocaleDateString()).should('be.visible')
    cy.get('#remove').should('be.visible')
  })
})
