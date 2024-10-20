import prisma from '../utils/prisma';

export interface IPasswordRepository {
  createPassword(userId: string, hashedPassword: string): Promise<void>;
}

class PasswordRepository implements IPasswordRepository {
  async createPassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.passwords.create({
      data: {
        userId: userId,
        password: hashedPassword,
      },
    });
  }
}

export const passwordRepository = new PasswordRepository();
