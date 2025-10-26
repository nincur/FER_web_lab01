import { expressjwt as jwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { env } from '../env';
import { Request, Response, NextFunction } from 'express';

// Machine-to-machine JWT verification middleware
export const m2mAuth = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${env.AUTH0_M2M_DOMAIN}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: env.AUTH0_M2M_AUDIENCE,
  issuer: `https://${env.AUTH0_M2M_DOMAIN}/`,
  algorithms: ['RS256'],
});

// Error handler for M2M authentication failures
export const m2mErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }
  next(err);
};
