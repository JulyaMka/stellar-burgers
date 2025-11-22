describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-testid=burger-ingredients]').as('burgerIngredients');
    cy.get('[data-testid=burger-constructor]').as('burgerConstructor');
    cy.get('[data-testid=ingredient-bun]').first().as('firstBun');
    cy.get('[data-testid=ingredient-main]').first().as('firstMain');
    cy.get('[data-testid=order-button]').as('orderButton');
  });

  it('должен загружать страницу конструктора', () => {
    cy.contains('Соберите бургер').should('be.visible');
    cy.get('@burgerIngredients').should('be.visible');
    cy.get('@burgerConstructor').should('be.visible');
  });

  it('должен отображать ингредиенты', () => {
    cy.contains('Булки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
    cy.contains('Начинки').should('be.visible');
  });

  it('должен добавлять булку в конструктор и проверять правильность', () => {
    cy.get('@firstBun').within(() => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.get('button').contains('Добавить').click();
    });

    cy.get('[data-testid=constructor-bun-top]').should('exist').and('contain', 'Краторная булка N-200i');
    cy.get('[data-testid=constructor-bun-bottom]').should('exist').and('contain', 'Краторная булка N-200i');
  });

  it('должен добавлять начинку в конструктор и проверять правильность', () => {
    cy.get('@firstMain').within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('[data-testid=constructor-ingredient]').should('exist').and('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('должен правильно открывать и закрывать модальное окно с деталями конкретного ингредиента', () => {
    cy.get('@firstBun').click();

    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=modal]').should('contain', 'Краторная булка N-200i');
    cy.get('[data-testid=modal]').contains('420').should('be.visible');

    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    cy.get('@firstBun').click();
    cy.get('[data-testid=modal-overlay]').click({ force: true });
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('должен перенаправлять на логин при попытке создать заказ без авторизации', () => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });

    cy.get('@firstBun').within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('@firstMain').within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('@orderButton').click();
    cy.url().should('include', '/login');
  });

  it('должен показывать активную кнопку при наличии булки', () => {
    cy.get('@firstBun').within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('@orderButton').should('not.be.disabled');
  });

  it('должен показывать неактивную кнопку без булки', () => {
    cy.get('@firstMain').within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('[data-testid=constructor-bun-top]').should('not.exist');
    cy.get('[data-testid=constructor-bun-bottom]').should('not.exist');
    cy.get('@orderButton').should('be.disabled');
  });

  it('должен успешно создавать заказ при авторизации', () => {
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.reload();
    cy.wait('@getIngredients');

    cy.get('[data-testid=ingredient-bun]').first().as('firstBun');
    cy.get('[data-testid=ingredient-main]').first().as('firstMain');
    cy.get('[data-testid=order-button]').as('orderButton');

    cy.get('@firstBun').within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('@firstMain').within(() => {
      cy.get('button').contains('Добавить').click();
    });

    cy.get('@orderButton').click();
    cy.wait('@createOrder');

    cy.get('[data-testid=modal]').should('be.visible');
    cy.contains('12345').should('be.visible');

    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    cy.get('[data-testid=constructor-bun-top]').should('not.exist');
    cy.get('[data-testid=constructor-bun-bottom]').should('not.exist');
    cy.get('[data-testid=constructor-ingredient]').should('not.exist');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
