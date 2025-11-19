import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
