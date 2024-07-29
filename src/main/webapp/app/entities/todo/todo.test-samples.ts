import { ITodo, NewTodo } from './todo.model';

export const sampleWithRequiredData: ITodo = {
  id: 8862,
  title: 'detailed impression',
};

export const sampleWithPartialData: ITodo = {
  id: 23404,
  title: 'against kid following',
  description: 'query greedily phooey',
};

export const sampleWithFullData: ITodo = {
  id: 565,
  title: 'gee',
  description: 'past gosh lanky',
};

export const sampleWithNewData: NewTodo = {
  title: 'ambitious',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
