import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { env } from 'hono/adapter';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

const app = new Hono<{
  Bindings: {
    SECRET: string,
    DATABASE_URL: string
  }
}>();

app.route('api/v1/user', userRouter);
app.route('api/v1/blog', blogRouter);




app.post('/haha', (c) => {
  return c.text('haha')
})








app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
