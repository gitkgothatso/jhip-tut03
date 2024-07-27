import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TodoComponent } from './list/todo.component';
import { TodoDetailComponent } from './detail/todo-detail.component';
import { TodoUpdateComponent } from './update/todo-update.component';
import TodoResolve from './route/todo-routing-resolve.service';

const todoRoute: Routes = [
  {
    path: '',
    component: TodoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TodoDetailComponent,
    resolve: {
      todo: TodoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TodoUpdateComponent,
    resolve: {
      todo: TodoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TodoUpdateComponent,
    resolve: {
      todo: TodoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default todoRoute;
