import { IUser } from 'app/entities/user/user.model';

export interface ITodo {
  id: number;
  title?: string | null;
  description?: string | null;
  ownedBy?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewTodo = Omit<ITodo, 'id'> & { id: null };
