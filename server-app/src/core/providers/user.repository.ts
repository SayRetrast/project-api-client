import { IUser } from '../interfaces/user.interface';
import prisma from '../utils/prisma';

export interface IUserRepository {
  getUser(userId: string): Promise<IUser | null>;
  createUser(username: string): Promise<IUser>;
}

class UserRepository implements IUserRepository {
  async getUser(userId: string): Promise<IUser | null> {
    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });

    return user;
  }

  async createUser(username: string): Promise<IUser> {
    const createdUser = await prisma.users.create({
      data: {
        username: username,
      },
    });

    return createdUser;
  }
}

export const userRepository = new UserRepository();
