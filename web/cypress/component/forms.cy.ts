import AdressForm from '@/components/forms/AddressForm.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import RolesForm from '@/components/forms/RolesForm.vue'


describe("form tests", () => {
  describe('addressform tests', () => {
    it('addressform correct input test', () => {
      cy.mount(AdressForm, {
        props:{
          // these are the default props
          readonly: false,
          street: "",
          number: "0",
          city: "",
          zip_code: "0",
        }
      })
      cy.get('#street').type("Teststraat")
      cy.get('#city').type('Gent')
      cy.get('#streetnr').type('{backspace}17')
      cy.get('#zipcode').type('{backspace}9000')
      cy.get('#street').should('have.value', 'Teststraat')
      cy.get('#streetnr').should('have.value', '17')
      cy.get('#city').should('have.value', 'Gent')
      cy.get('#zipcode').should('have.value', '9000')
    })

    it('addressform incorrect input test', () => {
      cy.mount(AdressForm, {
        // default props
      })
      cy.get('#streetnr').type('hallo') // you can only enter numbers
      cy.get('#streetnr').should('have.value', '0')
      cy.get('#zipcode').type('hallo') // you can only enter numbers
      cy.get('#zipcode').should('have.value', '0')
      cy.get('#zipcode').type('9000') // without backspace, the zip code will be 09000, which is an incorrect zipcode
      cy.contains('Ongeldige postcode')
    })

    it('addressform readonly test', () => {
      cy.mount(AdressForm, {
        props:{
          readonly: true,
        }
      })
      cy.get('#street').should('have.attr', 'readonly', 'readonly')
      cy.get('#city').should('have.attr', 'readonly', 'readonly')
      cy.get('#streetnr').should('have.attr', 'readonly', 'readonly')
      cy.get('#zipcode').should('have.attr', 'readonly', 'readonly')
    })

    it('addressform empty test', () => {
      cy.mount(AdressForm, {
        // default props
      })
      cy.get('#street').type('x{backspace}')
      cy.get('#city').type('x{backspace}')
      cy.get('#streetnr').clear()
      cy.get('#zipcode').clear()
      cy.contains('Geef een straat op.')
      cy.contains('Geef een stad op.')
      cy.contains('Geef een huisnummer.')
      cy.contains('Geef een postcode.')
    })
  })

  describe('conctactform test', () => {
    it('contactform correct input test', () => {
      cy.mount(ContactForm, {
        props: {
          // thse are the default props
          readonly: false,
          phone: "",
          email: "",
        },
      })
      cy.get('#phone').type('0123456789')
      cy.get('#email').type('test@test.com')
      cy.get('#phone').should('have.value', '0123456789')
      cy.get('#email').should('have.value', 'test@test.com')
    })

    it('contactform incorrect input test', () => {
      cy.mount(ContactForm, {
        // default props
      })
      // cy.get('#phone').type('hallo') // you should only be able to enter numbers,
      // cy.get('#phone').should('be.empty') // this not yet implemented now
      cy.get('#phone').type("012345") // phone number too short
      cy.contains('Telefoonnummer moet minimaal 9 tekens lang zijn.')
      cy.get('#email').type('thisisnotanemail') // email has to have the correct template
      cy.contains('Ongeldig e-mail adres.')
    })

    it('contactform empty test', () => {
      cy.mount(ContactForm, {
        // default props
      })
      cy.get('#phone').type('x{backspace}')
      cy.contains('Geef een telefoonnummer op.')
      cy.get('#email').type('x{backspace}')
      cy.contains('Geef een e-mail adres op.')
    })

    it('contactform readonly test', () => {
      cy.mount(ContactForm, {
        props:{
          readonly: true,
        }
      })
      cy.get('#phone').should('have.attr', 'readonly', 'readonly')
      cy.get('#email').should('have.attr', 'readonly', 'readonly')
    })
  })

  describe('roleform test', () => {
    it('roleform input test', () => {
      cy.mount(RolesForm, {
        props: {
          modelValue: [],
          readonly: false,
        },
      })
      cy.get('#student').check()
      cy.get('#superstudent').check()
      cy.get('#administrator').check()
      cy.get('#student').should('be.checked')
      cy.get('#superstudent').should('be.checked')
      cy.get('#administrator').should('be.checked')
      cy.get('#student').uncheck()
      cy.get('#superstudent').uncheck()
      cy.get('#administrator').uncheck()
      cy.get('#student').should('not.be.checked')
      cy.get('#superstudent').should('not.be.checked')
      cy.get('#administrator').should('not.be.checked')
    })

    it('rolesform readonly test', () => {
      cy.mount(RolesForm, {
        props:{
          readonly: true,
        }
      })
      cy.get('#student').should('have.attr', 'disabled', 'disabled')
      cy.get('#superstudent').should('have.attr', 'disabled', 'disabled')
      cy.get('#administrator').should('have.attr', 'disabled', 'disabled')
    })
  })

})
