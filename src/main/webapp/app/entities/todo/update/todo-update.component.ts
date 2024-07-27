import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITodo } from '../todo.model';
import { TodoService } from '../service/todo.service';
import { TodoFormService, TodoFormGroup } from './todo-form.service';

@Component({
  standalone: true,
  selector: 'jhi-todo-update',
  templateUrl: './todo-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TodoUpdateComponent implements OnInit {
  isSaving = false;
  todo: ITodo | null = null;

  protected todoService = inject(TodoService);
  protected todoFormService = inject(TodoFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TodoFormGroup = this.todoFormService.createTodoFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todo }) => {
      this.todo = todo;
      if (todo) {
        this.updateForm(todo);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const todo = this.todoFormService.getTodo(this.editForm);
    if (todo.id !== null) {
      this.subscribeToSaveResponse(this.todoService.update(todo));
    } else {
      this.subscribeToSaveResponse(this.todoService.create(todo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(todo: ITodo): void {
    this.todo = todo;
    this.todoFormService.resetForm(this.editForm, todo);
  }
}
