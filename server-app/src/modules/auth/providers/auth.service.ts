interface IAuthService {
  signIn(): Promise<void>;
  signUp(): Promise<void>;
  signOut(): Promise<void>;
}

export class AuthService implements IAuthService {
  async signIn(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async signUp(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private generateTokens(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
