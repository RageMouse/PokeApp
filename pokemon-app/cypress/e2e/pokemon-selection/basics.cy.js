/// <reference types="cypress" />

describe('example to-do app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('check if correct page opened', () => {
        cy.get('button').should('have.text', "Submit")
        cy.get("input[placeholder=\"Jouw naam\"]").type("<3");
    })

    it('submit name', () => {
        cy.get("input[placeholder=\"Jouw naam\"]").type("<3");
        cy.get('button').should('have.text', "Submit").last().click()
    })
})
