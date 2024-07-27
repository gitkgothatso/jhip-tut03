import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../todo.test-samples';

import { TodoFormService } from './todo-form.service';

describe('Todo Form Service', () => {
  let service: TodoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoFormService);
  });

  describe('Service methods', () => {
    describe('createTodoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTodoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });

      it('passing ITodo should create a new form with FormGroup', () => {
        const formGroup = service.createTodoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });
    });

    describe('getTodo', () => {
      it('should return NewTodo for default Todo initial value', () => {
        const formGroup = service.createTodoFormGroup(sampleWithNewData);

        const todo = service.getTodo(formGroup) as any;

        expect(todo).toMatchObject(sampleWithNewData);
      });

      it('should return NewTodo for empty Todo initial value', () => {
        const formGroup = service.createTodoFormGroup();

        const todo = service.getTodo(formGroup) as any;

        expect(todo).toMatchObject({});
      });

      it('should return ITodo', () => {
        const formGroup = service.createTodoFormGroup(sampleWithRequiredData);

        const todo = service.getTodo(formGroup) as any;

        expect(todo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITodo should not enable id FormControl', () => {
        const formGroup = service.createTodoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTodo should disable id FormControl', () => {
        const formGroup = service.createTodoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
