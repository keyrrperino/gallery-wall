import type { User } from 'database';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DatabaseSessionAttributes = {
  userId?: string;
};
export type DatabaseUserAttributes = PartialBy<User, 'id'>;
