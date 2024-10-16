interface IRestController {
  signIn(): Promise<void>;
  signUp(): Promise<void>;
  signOut(): Promise<void>;
}

export class RestController implements IRestController {
  async signIn(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async signUp(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
