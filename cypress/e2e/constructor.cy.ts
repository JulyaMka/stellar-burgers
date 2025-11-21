describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('должен загружать страницу конструктора', () => {
    cy.contains('Соберите бургер').should('be.visible');
    cy.get('[data-testid=burger-ingredients]').should('be.visible');
    cy.get('[data-testid=burger-constructor]').should('be.visible');
  });

  it('должен отображать ингредиенты', () => {
    cy.contains('Булки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
    cy.contains('Начинки').should('be.visible');
  });

  it('должен добавлять булку в конструктор', () => {
    cy.get('[data-testid=ingredient-bun]')
      .first()
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('[data-testid=constructor-bun-top]').should('exist');
    cy.get('[data-testid=constructor-bun-bottom]').should('exist');
  });

  it('должен добавлять начинку в конструктор', () => {
    cy.get('[data-testid=ingredient-main]')
      .first()
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('[data-testid=constructor-ingredient]').should('exist');
  });

  it('должен правильно открывать и закрывать модальное окно ингредиента', () => {
    cy.get('[data-testid=ingredient-bun]').first().click();
    cy.get('[data-testid=modal]').should('be.visible');

    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('420').should('be.visible');

    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    cy.get('[data-testid=ingredient-bun]').first().click();
    cy.get('[data-testid=modal-overlay]').click({ force: true });
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('должен перенаправлять на логин при попытке создать заказ без авторизации', () => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });

    cy.get('[data-testid=ingredient-bun]')
      .first()
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('[data-testid=ingredient-main]')
      .first()
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('[data-testid=order-button]').click();
    cy.url().should('include', '/login');
  });

  it('должен показывать активную кнопку при наличии булки', () => {
    cy.get('[data-testid=ingredient-bun]')
      .first()
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('[data-testid=order-button]').should('not.be.disabled');
  });

  it('должен показывать неактивную кнопку без булки', () => {
    cy.get('[data-testid=ingredient-main]')
      .first()
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('[data-testid=constructor-bun-top]').should('not.exist');
    cy.get('[data-testid=constructor-bun-bottom]').should('not.exist');
    cy.get('[data-testid=order-button]').should('be.disabled');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
