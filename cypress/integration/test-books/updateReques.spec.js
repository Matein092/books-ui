const { describe } = require("mocha");
import book from '../fixtures/exampleBook.json';

let response;
const updatedBook = {
    "id":book.id,
    "name":"Updated name: "+book.name,
    "author":"Updated author: "+book.author

}
describe('When the user wants to update a created book',() => {

    before(() => {
        cy.intercept('POST', '/books').as('new-book')
        cy.visit('/');
        cy.get('.ant-select-selection-item').click() 
        cy.contains('50 / page').click()
        cy.getBySel('btn-add-book').click();
        cy.getBySel('inp-new-name').click().type(book.name);
        cy.getBySel('inp-new-author').click().type(book.author);
        cy.getBySel('btn-new-save').click();
        cy.wait('@new-book').then((int) => {
            book.id = int.response.body.id;
            updatedBook.id = int.response.body.id;
        })
        
    })

    describe('When a user wants to update a book',() => {
        before(() => {
            cy.intercept('PUT', '/books/**').as('updated-book')
            cy.visit('/');
            cy.get('.ant-select-selection-item').click() 
            cy.contains('50 / page').click()
            cy.getBySel(`tr-book-${book.id}`).within(() => {
                cy.get('td').eq(3).click();
            });
            cy.getBySel('inp-new-name').click().clear().type(updatedBook.name);
            cy.getBySel('inp-new-author').click().clear().type(updatedBook.author);
            cy.getBySel('btn-new-save').click();
            cy.wait('@updated-book').then((int) => response = int.response)
            
        })

        it('So the status code would be 200',() => {
            expect(response.statusCode).to.equal(200); 
        })

        it('Then [name,author] are the updated values',() => {
            let resBook = response.body;
            expect(resBook).to.deep.equal(updatedBook);
        });
    });

});