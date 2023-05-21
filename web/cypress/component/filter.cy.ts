import LargeFilter from '@/components/filter/LargeFilter.vue'
import DashBoardSearch from '@/components/filter/DashBoardSearch.vue'
import DateRange from '@/components/filter/DateRange.vue'

describe("filter tests", () => {
  it('largefilter test', () => {
    cy.mount(LargeFilter, {
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
    // can't add first day later than last day
    cy.contains("Eerste dag").parent().type('2023-07-04') // has to be YYYY-MM-DD format
    cy.contains("Eerste dag").parent().should('have.value', '')
    cy.contains("Eerste dag").parent().type('2023-05-04')
    cy.contains("Laatste dag").parent().type('2023-06-04')
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

  it('dashboardsearch admin test', () => {
    cy.mount(DashBoardSearch, {
      props: {
        admin: true,
      },
    })
    cy.contains('Verborgen').click()
    cy.get('#hidden').should('be.checked')
    cy.contains('Zoek in de tabel').should('be.visible')
    cy.get('#search').type('test')
    cy.get('#search').should('have.value', 'test')
  })

  it('dashboardsearch not admin test', () => {
    cy.mount(DashBoardSearch, {
      props: {
        admin: false,
      },
    })
    cy.contains('Verborgen').should('not.exist')
    cy.contains('Zoek in de tabel').should('be.visible')
    cy.get('#search').type('test')
    cy.get('#search').should('have.value', 'test')
  })

  it('daterange test', () => {
    const start:Date = new Date('2023-05-12')
    const end:Date = new Date('2023-06-01')
    cy.mount(DateRange, {
      props: {
        startDate: start,
        endDate: end,
      },
    })
    cy.get('#start').should('have.value', '2023-05-12')
    cy.get('#end').should('have.value', '2023-06-01')
    cy.get('#start').click().type('2023-06-01')
    cy.get('#end').click().type('2023-06-06')
    cy.get('#start').should('have.value', '2023-06-01')
    cy.get('#end').should('have.value', '2023-06-06')
  })
})
