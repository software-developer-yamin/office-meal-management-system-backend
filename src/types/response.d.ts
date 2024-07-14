import { Role } from '@prisma/client';

export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

declare module 'express-serve-static-core' {
  export interface Request {
    user: {
      id: number;
      email: string;
      role: Role;
    };
  }
}
