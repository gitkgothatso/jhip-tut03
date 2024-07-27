import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITodo, NewTodo } from '../todo.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITodo for edit and NewTodoFormGroupInput for create.
 */
type TodoFormGroupInput = ITodo | PartialWithRequiredKeyOf<NewTodo>;

type TodoFormDefaults = Pick<NewTodo, 'id'>;

type TodoFormGroupContent = {
  id: FormControl<ITodo['id'] | NewTodo['id']>;
  title: FormControl<ITodo['title']>;
  description: FormControl<ITodo['description']>;
};

export type TodoFormGroup = FormGroup<TodoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TodoFormService {
  createTodoFormGroup(todo: TodoFormGroupInput = { id: null }): TodoFormGroup {
    const todoRawValue = {
      ...this.getFormDefaults(),
      ...todo,
    };
    return new FormGroup<TodoFormGroupContent>({
      id: new FormControl(
        { value: todoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(todoRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(todoRawValue.description),
    });
  }

  getTodo(form: TodoFormGroup): ITodo | NewTodo {
    return form.getRawValue() as ITodo | NewTodo;
  }

  resetForm(form: TodoFormGroup, todo: TodoFormGroupInput): void {
    const todoRawValue = { ...this.getFormDefaults(), ...todo };
    form.reset(
      {
        ...todoRawValue,
        id: { value: todoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TodoFormDefaults {
    return {
      id: null,
    };
  }
}
