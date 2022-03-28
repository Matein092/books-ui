const { describe } = require("mocha");

let response;
describe('When user wants to make a consult',() => {

    before(() => {
        cy.intercept('GET', '/books').as('books')
        cy.visit('/');
        cy.get('.ant-select-selection-item').click() 
        cy.contains('50 / page').click()
        cy.wait('@books').then((int) => response=int.response)
    })

    it('So the status code would be 200',() => {
        expect(response.statusCode).to.equal(200); 
    })

    it('So the display more than 0 books',async() => { 
        cy.get('tr').within(rowsOfBooks => {
            let numRows = Object.keys(rowsOfBooks).length;
            expect(numRows).to.be.greaterThan(1) 
        });
    });

});