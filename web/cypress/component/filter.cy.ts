import Filter from '@/components/filter/LargeFilter.vue'

describe("filter tests", () => {
  it('largefilter test', () => {
    cy.mount(Filter, {
      props: {
        search_by_labels: ["test1", "test2"],
        filter_items: ["status1", "status2"],
        selected_filters: [],
        sort_items: ["date", "alphabetical"],
        start_date: new Date(),
        enable_start_date: true,
        end_date: new Date(),
        enable_end_date: true,
      },
    })
    // searchbar should say "zoek per test1"
    cy.contains("Zoek per test1").should('be.visible')
    cy.contains("Zoek per test2").should('not.exist')
    // the filters are not yet visible
    cy.get('#dropdown').should('not.be.visible')
    cy.get("#showfilters").click()
    // now the filters are visible
    cy.get('#dropdown').should('be.visible')
    // add filters
    cy.contains("Eerste dag").parent().type('2023-01-04') // has to be YYYY-MM-DD format
    cy.contains('Zoekcategorie').parent().click()
    cy.contains("test2").click()
    // now the searchbar should say "zoek per test2"
    cy.contains("Zoek per test2").should('be.visible')
    cy.contains("Zoek per test1").should('not.exist')
    cy.contains('status1').click()
    cy.contains('alphabetical').click()
    cy.contains('Dalend').click()
    // hide filters again
    cy.get("#showfilters").click()
    cy.get('#dropdown').should('not.be.visible')
  })
})
