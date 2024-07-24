/// <reference types='cypress' />

context("Controles RPVFinance", () => {
    beforeEach(() => {
      // Visitar o endereço da aplicação antes de cada teste
      cy.visit("https://dev-finance.netlify.app/");
    });
  
    it("cadastrar entradas", () => {
      // Abrir o modal de nova transação
      cy.get("#transaction .button").click();
  
      // Preencher os campos do formulário para uma entrada
      cy.get("[name=description]").type("Salário");
      cy.get("[name=amount]").type("2500");
      cy.get("[type=date]").type("2023-07-22");
  
      // Submeter o formulário
      cy.get("button").contains("Salvar").click();
  
      // Verificar se a transação foi adicionada na tabela
      cy.get("#data-table tbody tr").should("have.length", 1);
  
      // Verificar se a descrição, valor e data estão corretos na tabela
      cy.get("#data-table tbody tr").should(($tr) => {
        const cells = $tr.find("td");
        expect(cells.eq(0)).to.contain.text("Salário");
        expect(cells.eq(1)).to.contain.text("2.500,00");
        expect(cells.eq(2)).to.contain.text("22/07/2023");
      });
  
      // Verificar se os valores foram atualizados corretamente no balanço
      cy.get("#incomeDisplay").should("contain.text", "2.500,00");
      cy.get("#totalDisplay").should("contain.text", "2.500,00");
    });
  
    it("cadastrar saídas", () => {
      // Abrir o modal de nova transação
      cy.get("#transaction .button").click();
  
      // Preencher os campos do formulário para uma saída
      cy.get("[name=description]").type("Aluguel");
      cy.get("[name=amount]").type("-500"); // Valor negativo para saída
      cy.get("[type=date]").type("2023-07-22");
  
      // Submeter o formulário
      cy.get("button").contains("Salvar").click();
  
      // Verificar se a transação foi adicionada na tabela
      cy.get("#data-table tbody tr").should("have.length", 1);
  
      // Verificar se a descrição, valor e data estão corretos na tabela
      cy.get("#data-table tbody tr").should(($tr) => {
        const cells = $tr.find("td");
        expect(cells.eq(0)).to.contain.text("Aluguel");
        expect(cells.eq(1)).to.contain.text("-R$ 500,00");
        expect(cells.eq(2)).to.contain.text("22/07/2023");
      });
  
      // Verificar se os valores foram atualizados corretamente no balanço
      cy.get("#expenseDisplay").should("contain.text", "500,00");
      cy.get("#totalDisplay").should("contain.text", "-R$ 500,00");
    });
  
    it("remover lançamento", () => {
      // Cadastrar uma entrada para depois removê-la
      cy.get("#transaction .button").click();
      cy.get("[name=description]").type("Salário");
      cy.get("[name=amount]").type("2500");
      cy.get("[type=date]").type("2023-07-22");
      cy.get("button").contains("Salvar").click();
  
      // Verificar se a transação foi adicionada na tabela
      cy.get("#data-table tbody tr").should("have.length", 1);
  
      // Remover a transação
      cy.get("#data-table tbody tr").find("img[onclick*='Transaction.remove']").click();
  
      // Verificar se a tabela está vazia após a remoção
      cy.get("#data-table tbody tr").should("have.length", 0);
  
      // Verificar se os valores foram atualizados corretamente no balanço
      cy.get("#incomeDisplay").should("contain.text", "0,00");
      cy.get("#totalDisplay").should("contain.text", "0,00");
    });
  });