const { describe } = require("mocha");
import book from '../fixtures/exampleBook.json';

let response;
let trIdentifier;
describe('Given a created book when the user wants to delete that book',() => {

    before(() => {
        cy.intercept('POST', '/books').as('new-book')
        cy.visit('/');
        cy.get('.ant-select-selection-item').click() 
        cy.contains('50 / page').click()
        cy.getBySel('btn-add-book').click();
        cy.getBySel('inp-new-name').click().type(book.name);
        cy.getBySel('inp-new-author').click().type(book.author);
        cy.getBySel('btn-new-save').click();
        cy.wait('@new-book').then((int) => response=int.response)
    })

    describe('When the user wants to delete the book',() => {
        beforeEach(() => {
            cy.visit('/');
        });

        before(() => {
            cy.visit('/');
            cy.intercept('DELETE', '/books/**').as('delete-books')
            cy.get('.ant-select-selection-item').click() //With the pagination, should do Conditional Testing and it's not a good idea for e2e
            cy.contains('50 / page').click()
            let id = response.body.id;
            trIdentifier = 'tr-book-'+id;
            cy.getBySel(trIdentifier).within(() => {
                cy.get('td').eq(0).click();
            });
            cy.getBySel('btn-delete-books').click();
            cy.wait('@delete-books').then((int) => response=int.response)
        });

        it('Then status code should be 200 OK',() => {
            expect(response.statusCode).to.equal(200); 
        })

        it('Then book does not appear in the web page - DOM',() => {
            cy.getBySel(trIdentifier).should("not.exist");
        });
    });

});