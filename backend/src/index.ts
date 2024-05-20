import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono()

app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: env.DATABASE_URL,
    }).$extends(withAccelerate());

  const body = await c.req.json();  

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password
    }
  })

  // const token = sign({ id: user.id})

  return c.text('signup route')
})


app.post('/api/v1/user/signin', (c) => {
  return c.text('signin route')
})


app.post('/api/v1/blog', (c) => {
  return c.text('see blog')
})


app.put('/api/v1/blog', (c) => {
  return c.text('put blog')
})


app.get('/api/v1/blog/:id', (c) => {
  return c.text('specific blog')
})


app.get('/api/v1/blog/bulk', (c) => {
  return c.text('all blogs ig')
})





app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
