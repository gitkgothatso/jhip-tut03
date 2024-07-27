import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 25689,
  login: 'kRQ16a',
};

export const sampleWithPartialData: IUser = {
  id: 30330,
  login: 'sV7',
};

export const sampleWithFullData: IUser = {
  id: 30882,
  login: 'C9A',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
