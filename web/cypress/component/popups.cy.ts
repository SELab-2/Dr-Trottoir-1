import CardPopup from '@/components/popups/CardPopup.vue'
import Loader from '@/components/popups/Loader.vue'
import StartRoundPopup from '@/components/popups/StartRoundPopupContent.vue'

describe("popup tests", () => {
  it.only('cardpopup test', () => {
    cy.mount(CardPopup, {
      props: ["modelValue"]
    })
    // TODO the mount doesn't give an error, but it's just a blank screen
  })

  it('loader popup test', () => {
    cy.mount(Loader, {
    })
    // this is just a spinnning circle, so there is not really anything to test
  })

  it('start round popup test', () => {
    cy.mount(StartRoundPopup, {
      props: {
        oncancel: () => {},
        onsubmit: () => {},
      }
    })
    cy.contains('Start ronde')
    cy.contains('Je staat op het punt een ronde te starten. Het huidige tijdstip zal opgeslagen worden als start ' +
      'tijdstip. Ben je zeker dat je de ronde wilt starten?')
    cy.get('#start').contains('Start ronde')
    cy.get('#cancel').contains( 'Annuleer')
  })
})
