import { Hono } from 'hono';
import v1 from './v1';
import { renderer } from './renderer';

const app = new Hono();
app.use(renderer);

app.route('/v1', v1);
app.get('/', (c) => {
  return c.render(<h1>Welcome to the companies API</h1>);
});

export default app;
