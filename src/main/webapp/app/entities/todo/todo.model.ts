export interface ITodo {
  id: number;
  title?: string | null;
  description?: string | null;
}

export type NewTodo = Omit<ITodo, 'id'> & { id: null };
