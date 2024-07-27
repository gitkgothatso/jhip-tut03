import { ITodo, NewTodo } from './todo.model';

export const sampleWithRequiredData: ITodo = {
  id: 9430,
  title: 'ew',
};

export const sampleWithPartialData: ITodo = {
  id: 6719,
  title: 'demilitarize quince',
};

export const sampleWithFullData: ITodo = {
  id: 29417,
  title: 'brr fooey stigmatise',
  description: 'acquire',
};

export const sampleWithNewData: NewTodo = {
  title: 'likewise anenst gee',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
