import { User } from '../../../shared/types.js';
import { SEED_USER, DEMO_USER } from '../data/seed.js';

export interface UserRepo {
  getCurrentUser(): Promise<User>;
  getDemoUser(): Promise<User>;
}

export class InMemoryUserRepo implements UserRepo {
  private currentUser: User = { ...SEED_USER };
  private demoUser: User = { ...DEMO_USER };

  async getCurrentUser(): Promise<User> {
    return { ...this.currentUser };
  }

  async getDemoUser(): Promise<User> {
    return { ...this.demoUser };
  }
}

export const userRepo = new InMemoryUserRepo();
