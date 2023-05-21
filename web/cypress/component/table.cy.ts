import Table from '@/components/table/Table.vue'
import {Header} from "@/components/table/Header";
import {RowType} from "@/components/table/RowType";
import {BuildingQuery, Result} from "@selab-2/groep-1-query";



describe("custom table test", () => {
  it('table entry test', () => {
    const header1: Header<Result<BuildingQuery>> = new Header<Result<BuildingQuery>>({
      id: 0,
      name: "Gebouw",
      get: (e) => e.name,
      type: RowType.TEXT,
      sortable: false,
    })
    const header2: Header<Result<BuildingQuery>> = new Header<Result<BuildingQuery>>({
      id: 1,
      name: "Adres",
      get: (e) =>
        e.address.street + " " + e.address.number,
      type: RowType.TEXT,
      sortable: false,
    })
    cy.mount(Table, {
      props: {
        entries: [
          {
            id: 6,
            name: "testgebouw",
            address: {
              street: "teststraat",
              number: 5,
              zip_code: 9000,
              city: "Gent",
            }
          },
          {
            id: 1,
            name: "andergebouw",
            address: {
              street: "anderestraat",
              number: 7,
              zip_code: 9000,
              city: "Gent"
            }
          },
        ],
        headers: [header1, header2],
      },
    })
    cy.get('#table').then( () => {
      cy.contains('th', 'Gebouw').should('be.visible')
      cy.contains('th', 'Adres').should('be.visible')
      cy.contains('td', 'testgebouw').should('be.visible')
      cy.contains('td', 'andergebouw').should('be.visible')
      cy.contains('td', 'teststraat 5').should('be.visible')
      cy.contains('td', 'anderestraat 7').should('be.visible')
      // for this test, there is no City header, so cities shouldn't be displayed in the table
      cy.contains('td', 'Gent').should('not.exist')
    })
  })

  it('table sort test', () => {
    const header1: Header<Result<BuildingQuery>> = new Header<Result<BuildingQuery>>({
      id: 0,
      name: "Gebouw",
      get: (e) => e.name,
      type: RowType.TEXT,
      sortable: true,
      order: "desc",
    })
    const header2: Header<Result<BuildingQuery>> = new Header<Result<BuildingQuery>>({
      id: 1,
      name: "Adres",
      get: (e) =>
        e.address.street + " " + e.address.number,
      type: RowType.TEXT,
      sortable: true,
      order: "desc",
    })
    cy.mount(Table, {
      props: {
        entries: [
          {
            id: 6,
            name: "testgebouw",
            address: {
              street: "teststraat",
              number: 5,
              zip_code: 9000,
              city: "Gent"
            }
          },
          {
            id: 1,
            name: "andergebouw",
            address: {
              street: "anderestraat",
              number: 7,
              zip_code: 9000,
              city: "Gent"
            }
          },
        ],
        headers: [header1, header2],
      },
    })
    // the first row is now the row of testgebouw
    cy.get('td').first().contains( 'testgebouw').should('be.visible')
    cy.get('td').eq(1).contains('teststraat 5').should('be.visible')
    // sort by building ascending
    cy.get('button').first().click()
    // once the data is reordered, the first row should contain andergebouw
    cy.get('td').first().contains('andergebouw').should('be.visible')
    cy.get('td').eq(1).contains('anderestraat 7').should('be.visible')
    // sort by address ascending
    cy.get('button').eq(1).click()
    // since the addresses are already in order, nothing should change
    cy.get('td').eq(1).contains('anderestraat 7').should('be.visible')
    // sort by address descending
    cy.get('button').eq(1).click()
    // this should have changed the order
    cy.get('td').eq(1).contains('teststraat 5').should('be.visible')
  })
})
