import type { JwtPayload } from 'jwt-decode';

export interface UserJwtPayload extends JwtPayload {
  username: string;
}
