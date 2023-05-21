import BuildingCard from '@/components/cards/BuildingCard.vue'
import BuildingInfoCard from '@/components/cards/BuildingInfoCard.vue'
import BuildingSelectCard from '@/components/cards/BuildingSelectCard.vue'
import ImageCard from '@/components/cards/ImageCard.vue'
import RoundCard from '@/components/cards/RoundCard.vue'
import RoundSelectCard from '@/components/cards/RoundSelectCard.vue'
import RoundBuildingCard from '@/components/cards/RoundBuildingCard.vue'
import BuildingAnalyticCard from '@/components/cards/BuildingAnalyticCard.vue'
import PasswordInputCard from '@/components/cards/PasswordInputCard.vue'
import RemovedCard from '@/components/cards/RemovedCard.vue'
import UserAnalyticCard from '@/components/cards/UserAnalyticCard.vue'


describe("card tests", () => {
  it('buildingcard test', () => {
    const date: Date = new Date()
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
          },
          images: []
        },
        filter_data: {
          filters: ["opmerkingen"],
          start_day: date,
          end_day: date,
        },
      }
    })
    // all info present
    cy.contains('testgebouw').should('be.visible')
    cy.contains('test gebruiker').should('be.visible')
    cy.contains('teststraat 5 Gent').should('be.visible')
    cy.contains(date.toLocaleDateString()).should('be.visible')
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

  it('buildingselectcard test', () => {
    cy.mount(BuildingSelectCard, {
      props: {
        name: "testgebouw",
        address: "teststraat 1",
      },
    })
    // all info present
    cy.contains('testgebouw').should('be.visible')
    cy.contains('teststraat 1').should('be.visible')
    cy.get('#up').should('be.visible')
    cy.get('#down').should('be.visible')
    cy.get('#remove').should('be.visible')
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

  it('passwordinputcard test', () => {
    cy.mount(PasswordInputCard, {})
    // fill in passwords that do not meet the requirements
    cy.contains("Wachtwoord").should('be.visible')
    cy.get('#password').type('wacht')
    cy.contains('Wachtwoord moet minstens 8 karakters lang zijn').should('be.visible')
    cy.get('#password').clear()
    cy.get('#password').type('wachtwoord')
    cy.contains('Wachtwoord moet minstens 1 getal bevatten').should('be.visible')
    cy.get('#password').clear()
    cy.get('#password').type('wachtwoord1')
    cy.contains('Wachtwoord moet minstens 1 hoofdletter(s) bevatten').should('be.visible')
    cy.get('#password').clear()
    cy.get('#password').type('Wachtwoord1')
    cy.contains('Wachtwoord moet minstens 1 speciale karakter(s) bevatten').should('be.visible')
    cy.get('#password').clear()
    cy.contains('Wachtwoord mag niet leeg zijn!').should('be.visible')
    // this password meets the requirements
    cy.get('#password').type('W@chtwoord1')
    cy.contains('Wachtwoorden bestaan minstens uit 1 getal, 1 hoofdletter en 1 speciaal karakter.').should('be.visible')
    // repeat the wrong password
    cy.get('#repeat').type('W@chtwoord2')
    cy.contains('Wachtwoorden moeten overeenkomen').should('be.visible')
    // repeat correct password
    cy.get('#repeat').clear()
    cy.get('#repeat').type('W@chtwoord1')
    cy.contains('Wachtwoorden moeten overeenkomen').should('not.exist')
  })

  it('removedcard tests', () => {
    cy.mount(RemovedCard, {
      props: {
        show: true,
        title: "Deze account is verwijderd.",
        restore: () => {},
      }
    })
    cy.contains('Deze account is verwijderd.').should('be.visible')
    cy.contains('Herstel').should('be.visible')
  })

  it('roundcard with zero progress', () => {
    const date: Date = new Date()
    cy.mount(RoundCard, {
      props: { filtered: {
          roundName: 'test round',
          roundStart: null,
          roundEnd: null,
          roundDate: date,
          studentName: 'test student',
          completedBuildings: 0,
          totalBuildings: 5,
          amountOfComments: 0,
        }
      },
    })
    // all info present
    cy.contains('test round').should('be.visible')
    cy.contains('test student').should('be.visible')
    cy.contains(date.toLocaleDateString()).should('be.visible')
    cy.get('#buildings').contains('5').should('be.visible')
    cy.contains('Niet begonnen').should('be.visible')
    cy.get('#comments').should('not.exist')
  })

  it('roundcard with some progress', () => {
    const date: Date = new Date()
    cy.mount(RoundCard, {
      props: { filtered: {
          roundName: 'test round',
          roundStart: date,
          roundEnd: null,
          roundDate: date,
          studentName: 'test student',
          completedBuildings: 2,
          totalBuildings: 5,
          amountOfComments: 1,
        }
      },
    })
    // all info present
    cy.contains('test round').should('be.visible')
    cy.get('#start').should('not.exist')
    cy.get('#end').should('not.exist')
    cy.contains('test student').should('be.visible')
    cy.get('#buildings').contains('5').should('be.visible')
    cy.contains('Bezig 2/5').should('be.visible')
    cy.contains(date.toLocaleDateString()).should('be.visible')
    cy.contains(date.toLocaleTimeString('nl', {hour: "2-digit", minute: "2-digit",})).should('be.visible')
    cy.get('#comments').should('be.visible')
  })

  it('roundcard with full progress', () => {
    const date: Date = new Date()
    const enddate: Date = new Date("2023-06-30")
    cy.mount(RoundCard, {
      props: { filtered: {
          roundName: 'test round',
          roundStart: date,
          roundEnd: enddate,
          roundDate: date,
          studentName: 'test student',
          completedBuildings: 5,
          totalBuildings: 5,
          amountOfComments: 1,
        }
      },
    })
    // all info present
    cy.contains('test round').should('be.visible')
    cy.contains('test student').should('be.visible')
    cy.get('#buildings').contains('5').should('be.visible')
    cy.contains('Klaar').should('be.visible')
    cy.contains(date.toLocaleDateString()).should('be.visible')
    cy.contains(date.toLocaleTimeString('nl', {hour: "2-digit", minute: "2-digit",})).should('be.visible')
    cy.contains(enddate.toLocaleTimeString('nl', {hour: "2-digit", minute: "2-digit",})).should('be.visible')
    cy.get('#comments').should('be.visible')
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

  it('roundbuildingcard test', () => {
    cy.mount(RoundBuildingCard, {
      props: {
        building: {
          id: 1,
          name: "test gebouw",
          address: {
            street: "teststraat",
            number: "1",
            city: "Gent",
            zip_code: "9000",
          }
        }},
    })
    cy.contains("test gebouw").should('be.visible')
    cy.contains("teststraat 1").should('be.visible')
    cy.contains("9000 Gent").should('be.visible')
  });

  it('building analytic card test', () =>{
    cy.mount(BuildingAnalyticCard, {
      props: {
        id: 1
      }
    })
    cy.contains('Prestaties').should('be.visible')
    cy.contains('Bekijk het aantal gepresteerde uren per maand.').should('be.visible')
  })

  it('user analytic card test', () => {
    cy.mount(UserAnalyticCard, {
      props: {
        id: 1
      }
    })
    cy.contains('Prestaties').should('be.visible')
    cy.contains('Bekijk het aantal gepresteerde uren per maand.').should('be.visible')
  })
})
