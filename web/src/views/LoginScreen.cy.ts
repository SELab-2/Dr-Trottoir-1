import LoginScreen from './LoginScreen.vue'

describe('<LoginScreen />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(LoginScreen)
  })
})