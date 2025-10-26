import { auth, requiresAuth } from 'express-openid-connect';
import { env } from '../env';

// Auth0 OIDC configuration for end-user login
export const oidcConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: env.AUTH0_SECRET,
  baseURL: env.AUTH0_BASE_URL,
  clientID: env.AUTH0_CLIENT_ID,
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  routes: {
    login: '/login',
    logout: '/logout',
    callback: '/callback',
  },
};

export const authMiddleware = auth(oidcConfig);
export const requireAuth = requiresAuth();
