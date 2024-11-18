import { FastifyRequest } from 'fastify';

export type SignUpParams = {
  request: FastifyRequest;
  username: string;
  password: string;
};

export type SignInParams = {
  request: FastifyRequest;
  username: string;
  password: string;
};

export type SignOutParams = {
  request: FastifyRequest;
  userId: string;
};

export type RenewTokensParams = {
  request: FastifyRequest;
  refreshToken: string;
};

export type TokensData = {
  accessToken: string;
  refreshToken: string;
};

export type CreateRegistrationLinkParams = {
  userId: string;
};
