import CardPopup from '@/components/popups/CardPopup.vue'
import Loader from '@/components/popups/Loader.vue'
import StartRoundPopup from '@/components/popups/StartRoundPopupContent.vue'

describe("popup tests", () => {
  it('cardpopup test', () => {
    cy.mount(CardPopup, {
      props: {
        modelValue: true
      }
    })
    // this is a blank canvas to create a popup, where modelValue indicates if the popup is active/visible or not
  })

  it('loader popup test', () => {
    cy.mount(Loader, {
    })
    // this is just a spinnning circle, so there is not really anything to test other than see if it works
  })

  it('start round popup test', () => {
    cy.mount(StartRoundPopup, {
      props: {
        oncancel: () => {},
        onsubmit: () => {},
      }
    })
    // all info present
    cy.contains('Start ronde').should('be.visible')
    cy.contains('Je staat op het punt een ronde te starten. Het huidige tijdstip zal opgeslagen worden als start ' +
      'tijdstip. Ben je zeker dat je de ronde wilt starten?').should('be.visible')
    cy.get('#start').contains('Start ronde').should('be.visible')
    cy.get('#cancel').contains( 'Annuleer').should('be.visible')
  })
})
