import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
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
  let userService: UserService;

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
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const todo: ITodo = { id: 456 };
      const ownedBy: IUser = { id: 4809 };
      todo.ownedBy = ownedBy;

      const userCollection: IUser[] = [{ id: 26337 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [ownedBy];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const todo: ITodo = { id: 456 };
      const ownedBy: IUser = { id: 21374 };
      todo.ownedBy = ownedBy;

      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(ownedBy);
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

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
