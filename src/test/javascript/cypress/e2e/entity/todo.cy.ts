import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Todo e2e test', () => {
  const todoPageUrl = '/todo';
  const todoPageUrlPattern = new RegExp('/todo(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const todoSample = { title: 'luminous' };

  let todo;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/todos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/todos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/todos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (todo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/todos/${todo.id}`,
      }).then(() => {
        todo = undefined;
      });
    }
  });

  it('Todos menu should load Todos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('todo');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Todo').should('exist');
    cy.url().should('match', todoPageUrlPattern);
  });

  describe('Todo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(todoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Todo page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/todo/new$'));
        cy.getEntityCreateUpdateHeading('Todo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/todos',
          body: todoSample,
        }).then(({ body }) => {
          todo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/todos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [todo],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(todoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Todo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('todo');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);
      });

      it('edit button click should load edit Todo page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Todo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);
      });

      it('edit button click should load edit Todo page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Todo');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);
      });

      it('last delete button click should delete instance of Todo', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('todo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', todoPageUrlPattern);

        todo = undefined;
      });
    });
  });

  describe('new Todo page', () => {
    beforeEach(() => {
      cy.visit(`${todoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Todo');
    });

    it('should create an instance of Todo', () => {
      cy.get(`[data-cy="title"]`).type('past gosh lanky');
      cy.get(`[data-cy="title"]`).should('have.value', 'past gosh lanky');

      cy.get(`[data-cy="description"]`).type('ambitious');
      cy.get(`[data-cy="description"]`).should('have.value', 'ambitious');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        todo = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', todoPageUrlPattern);
    });
  });
});
