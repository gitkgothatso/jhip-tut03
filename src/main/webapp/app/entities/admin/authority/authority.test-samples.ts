import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'e4ce2862-100b-4e7a-a2a0-65534b46de32',
};

export const sampleWithPartialData: IAuthority = {
  name: '276045f2-b401-47ac-9b48-c56ad1eddef1',
};

export const sampleWithFullData: IAuthority = {
  name: '05fcd403-9245-414a-af2d-a1a294f54b84',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
