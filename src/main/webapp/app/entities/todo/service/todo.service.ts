import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITodo, NewTodo } from '../todo.model';

export type PartialUpdateTodo = Partial<ITodo> & Pick<ITodo, 'id'>;

export type EntityResponseType = HttpResponse<ITodo>;
export type EntityArrayResponseType = HttpResponse<ITodo[]>;

@Injectable({ providedIn: 'root' })
export class TodoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/todos');

  create(todo: NewTodo): Observable<EntityResponseType> {
    return this.http.post<ITodo>(this.resourceUrl, todo, { observe: 'response' });
  }

  update(todo: ITodo): Observable<EntityResponseType> {
    return this.http.put<ITodo>(`${this.resourceUrl}/${this.getTodoIdentifier(todo)}`, todo, { observe: 'response' });
  }

  partialUpdate(todo: PartialUpdateTodo): Observable<EntityResponseType> {
    return this.http.patch<ITodo>(`${this.resourceUrl}/${this.getTodoIdentifier(todo)}`, todo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITodo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITodo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTodoIdentifier(todo: Pick<ITodo, 'id'>): number {
    return todo.id;
  }

  compareTodo(o1: Pick<ITodo, 'id'> | null, o2: Pick<ITodo, 'id'> | null): boolean {
    return o1 && o2 ? this.getTodoIdentifier(o1) === this.getTodoIdentifier(o2) : o1 === o2;
  }

  addTodoToCollectionIfMissing<Type extends Pick<ITodo, 'id'>>(
    todoCollection: Type[],
    ...todosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const todos: Type[] = todosToCheck.filter(isPresent);
    if (todos.length > 0) {
      const todoCollectionIdentifiers = todoCollection.map(todoItem => this.getTodoIdentifier(todoItem));
      const todosToAdd = todos.filter(todoItem => {
        const todoIdentifier = this.getTodoIdentifier(todoItem);
        if (todoCollectionIdentifiers.includes(todoIdentifier)) {
          return false;
        }
        todoCollectionIdentifiers.push(todoIdentifier);
        return true;
      });
      return [...todosToAdd, ...todoCollection];
    }
    return todoCollection;
  }
}
