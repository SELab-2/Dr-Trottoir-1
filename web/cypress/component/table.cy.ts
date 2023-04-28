import Table from '../../src/components/table/Table.vue'
import {Header} from "../../src/components/table/Header";
import {RowType} from "../../src/components/table/RowType";
import {BuildingQuery, Result} from "@selab-2/groep-1-query";

describe("custom table test", () => {
  it('', () => {
    // TODO test sorting
    cy.mount(Table, {
      props: {
        entries: [
          {id: 6, name: "testgebouw", address:
                {street: "teststraat", number: 5, zip_code: 9000, city: "Gent"}},
          {id: 1, name: "andergebouw", address:
                {street: "anderestraat", number: 7, zip_code: 9000, city: "Gent"}},
        ],
        headers: [{
            id: 0,
            name: "Gebouw",
            fit: false,
            get: (e) => e.name,
            type: RowType.TEXT,
            sortable: false,
          },
          {
            id: 1,
            name: "Adres",
            fit: false,
            get: (e) =>
              e.address.street + " " + e.address.number,
            type: RowType.TEXT,
            sortable: false,
          }
        ],
      },
    })
    cy.get('#table').then( () => {
      // cy.contains('th, Gebouw')
      // cy.contains('th, Adres')   // table heads aren't just plain text, so this doesn't work
      cy.contains('td', 'testgebouw')
      cy.contains('td', 'andergebouw')
      cy.contains('td', 'teststraat 5')
      cy.contains('td', 'anderestraat 7')
      // for this test, there is no City header, so cities shouldn't be displayed in the table
      cy.contains('td', 'Gent').should('not.exist')
    })
  })
})
