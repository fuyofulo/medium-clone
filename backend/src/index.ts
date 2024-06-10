import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';

const app = new Hono<{
  Bindings: {
    SECRET: string,
    DATABASE_URL: string
  }
}>();

app.use('/*', cors());
app.route('api/v1/user', userRouter);
app.route('api/v1/blog', blogRouter);


app.post('/haha', (c) => {
  return c.text('haha')
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
