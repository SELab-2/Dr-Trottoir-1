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
        building: {id: 6, name: "testgebouw", address:{street: "teststraat", number: 5, zip_code: 9000, city: "Gent"},
        syndicus: {user: {first_name: "test", last_name: "gebruiker"}}},
        start_date: new Date(),
        end_date: new Date(),
      },
    })
    cy.contains('testgebouw')
    cy.contains('test gebruiker')
    cy.contains('teststraat 5 Gent')
    cy.contains(((new Date())).toLocaleDateString())
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

  it('buildingselectcard show garbage test', () => {
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
    cy.contains('test image').should('not.exist')
    cy.contains('text').should('not.exist')
    cy.contains('button')
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
    cy.contains('text')
    cy.contains('button')
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
    cy.contains('test round')
    cy.get('#start')
    cy.get('#end')
    cy.contains('test student')
    cy.contains(datum.toLocaleDateString())
    cy.contains('5')
    cy.contains('Niet begonnen')
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
    cy.contains('test round')
    cy.get('#start').should('not.exist')
    cy.get('#end').should('not.exist')
    cy.contains('test student')
    cy.contains('5')
    cy.contains('Bezig 4/5')
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
    cy.contains('test round')
    cy.get('#start')
    cy.get('#end')
    cy.contains('test student')
    cy.contains('5')
    cy.contains('Klaar')
  })

  it.only('roundselectcard test', () => {
    const datum: Date = new Date()
    cy.mount(RoundSelectCard, {
      props: {
        name: 'test round',
        date: datum,
        time: "tijd",
        id: "1",
      },
    })
    cy.contains('test round')
    cy.contains('tijd')
    cy.contains(datum.toLocaleDateString())
    cy.get('#remove').should('be.visible')
  })
})
