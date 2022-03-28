const { describe } = require("mocha");
import book from '../fixtures/exampleBook.json';

let response;
describe('When a user wants to add a book',() => {

    before(() => {
        cy.intercept('POST', '/books').as('new-book')
        cy.visit('/');
        cy.get('.ant-select-selection-item').click() //With the pagination, should do Conditional Testing and it's not a good idea for e2e
        cy.contains('50 / page').click()
        cy.getBySel('btn-add-book').click();
        cy.getBySel('inp-new-name').click().type(book.name);
        cy.getBySel('inp-new-author').click().type(book.author);
        cy.getBySel('btn-new-save').click();
        cy.wait('@new-book').then((int) => response=int.response)
        
    })
    
    it('Then the book should be listed with the [name, author]',() => {
        let id = response.body.id;
        cy.getBySel(`tr-book-${id}`).within(() => {
            cy.get('td').eq(1).should('have.text', book.name);
            cy.get('td').eq(2).should('have.text', book.author);
        });
    })

});