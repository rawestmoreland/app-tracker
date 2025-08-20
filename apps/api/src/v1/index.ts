import { Hono } from 'hono';
import companies from './companies';

const app = new Hono();

app.route('/companies', companies);

export default app;
