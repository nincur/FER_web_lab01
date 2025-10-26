import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { env } from './env';
import { authMiddleware } from './auth/oidc';
import webRoutes from './routes/web';
import apiRoutes from './routes/api';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(authMiddleware);

app.use('/', webRoutes);
app.use('/', apiRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

const PORT = parseInt(env.PORT, 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

export default app;
