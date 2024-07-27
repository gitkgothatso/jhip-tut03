import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITodo } from '../todo.model';
import { TodoService } from '../service/todo.service';

const todoResolve = (route: ActivatedRouteSnapshot): Observable<null | ITodo> => {
  const id = route.params['id'];
  if (id) {
    return inject(TodoService)
      .find(id)
      .pipe(
        mergeMap((todo: HttpResponse<ITodo>) => {
          if (todo.body) {
            return of(todo.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default todoResolve;
