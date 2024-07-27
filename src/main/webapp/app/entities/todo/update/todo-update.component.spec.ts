import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { TodoService } from '../service/todo.service';
import { ITodo } from '../todo.model';
import { TodoFormService } from './todo-form.service';

import { TodoUpdateComponent } from './todo-update.component';

describe('Todo Management Update Component', () => {
  let comp: TodoUpdateComponent;
  let fixture: ComponentFixture<TodoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let todoFormService: TodoFormService;
  let todoService: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TodoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TodoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    todoFormService = TestBed.inject(TodoFormService);
    todoService = TestBed.inject(TodoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const todo: ITodo = { id: 456 };

      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      expect(comp.todo).toEqual(todo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodo>>();
      const todo = { id: 123 };
      jest.spyOn(todoFormService, 'getTodo').mockReturnValue(todo);
      jest.spyOn(todoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todo }));
      saveSubject.complete();

      // THEN
      expect(todoFormService.getTodo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(todoService.update).toHaveBeenCalledWith(expect.objectContaining(todo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodo>>();
      const todo = { id: 123 };
      jest.spyOn(todoFormService, 'getTodo').mockReturnValue({ id: null });
      jest.spyOn(todoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todo }));
      saveSubject.complete();

      // THEN
      expect(todoFormService.getTodo).toHaveBeenCalled();
      expect(todoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodo>>();
      const todo = { id: 123 };
      jest.spyOn(todoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(todoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
