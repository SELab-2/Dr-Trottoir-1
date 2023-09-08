import HomeNumberInputField from '@/components/inputfields/HomeNumberInputField.vue'
import ZipCodeInputField from '@/components/inputfields/ZipCodeInputField.vue'

describe("inputfield tests", () => {
  describe('HomeNumberInputField tests', () => {
    it('HomeNumberInputField correct input test', () => {
      cy.mount(HomeNumberInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: false,
        }
      })
      cy.contains('Huisnummer')
      cy.get('#streetnr').should('have.value', '0')
      cy.get('#streetnr').type('{backspace}32')
      cy.get('#streetnr').should('have.value', '32')
    })

    it('HomeNumberInputField incorrect input test', () => {
      cy.mount(HomeNumberInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: false,
        }
      })
      cy.contains('Huisnummer')
      cy.get('#streetnr').should('have.value', '0')
      cy.get('#streetnr').type('streetnr')
      cy.get('#streetnr').should('have.value', '0')
    })

    it('HomeNumberInputField empty input test', () => {
      cy.mount(HomeNumberInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: false,
        }
      })
      cy.contains('Huisnummer')
      cy.get('#streetnr').should('have.value', '0')
      cy.get('#streetnr').type('{backspace}')
      // cy.contains('Geef een huisnummer.')
    })

    it('HomeNumberInputField readonly test', () => {
      cy.mount(HomeNumberInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: true,
        }
      })
      cy.contains('Huisnummer')
      cy.get('#streetnr').should('have.value', '0')
      cy.get('#streetnr').should('have.attr', 'readonly', 'readonly')
    })
  })

  describe('ZipCodeInputField tests', () => {
    it('ZipCodeInputField correct input test', () => {
      cy.mount(ZipCodeInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: false,
        }
      })
      cy.contains('Post code')
      cy.get('#zipcode').should('have.value', '0')
      cy.get('#zipcode').type('{backspace}9000')
      cy.get('#zipcode').should('have.value', '9000')
    })

    it('ZipCodeInputField incorrect input test', () => {
      cy.mount(ZipCodeInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: false,
        }
      })
      cy.contains('Post code')
      cy.get('#zipcode').should('have.value', '0')
      cy.get('#zipcode').type('zipcode')
      cy.get('#zipcode').should('have.value', '0')
      cy.get('#zipcode').type('{backspace}1')
      // cy.contains("Ongeldige postcode")
    })

    it('ZipCodeInputField empty input test', () => {
      cy.mount(ZipCodeInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: false,
        }
      })
      cy.contains('Post code')
      cy.get('#zipcode').should('have.value', '0')
      cy.get('#zipcode').type('{backspace}')
      // cy.contains("Geef een postcode.")
    })

    it('ZipCodeInputField readonly test', () => {
      cy.mount(ZipCodeInputField, {
        props: {
          // these are the default props
          modelValue: '0',
          readonly: true,
        }
      })
      cy.contains('Post code')
      cy.get('#zipcode').should('have.value', '0')
      cy.get('#zipcode').should('have.attr', 'readonly', 'readonly')
    })

  })
})
