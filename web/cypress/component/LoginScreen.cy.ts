import LoginScreen from '../../src/views/account/LoginScreen.vue'

// dit geeft error en ik weet niet precies waarom: [Vuetify] Could not find defaults instance
describe('login screen', () => {
  it('render', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(LoginScreen)
  })
})
