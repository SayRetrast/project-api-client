export type SignUpUserParams = {
  username: string;
  userId: string;
  hashedPassword: string;
  refreshToken: string;
  userAgent: string;
};

export type SignInUserParams = {
  userId: string;
  refreshToken: string;
  userAgent: string;
};

export type SignOutUserParams = {
  userId: string;
  userAgent: string;
};

export type FindUserSessionByUserInfoParams = {
  userId: string;
  userAgent: string;
};

export type FindUserSessionByRefreshTokenParams = {
  refreshToken: string;
};

export type UpdateRefreshTokenParams = {
  userId: string;
  userAgent: string;
  refreshToken: string;
};

export type FindUserByIdParams = {
  userId: string;
};

export type GetUserIdAndPasswordParams = {
  username: string;
};

export type createRegistrationKeyParams = {
  userId: string;
  expirationDate: Date;
};

export type GetRegistrationKeyExpirationDateParams = {
  registrationKey: string;
};
