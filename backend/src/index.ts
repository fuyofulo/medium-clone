import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { env } from 'hono/adapter';

const app = new Hono<{
  Bindings: {
    SECRET: string,
    DATABASE_URL: string
  }
}>();

app.use('api/v1/blog/*', async (c, next) => {
  // get the header
  // verify the header
  // if heaader is correct, proceed 
  // if not, return 403

  const user = c.req.header;




})


app.post('/haha', (c) => {
  return c.text('haha')
})

app.post('/api/v1/signup', async (c) => {

  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

  const body = await c.req.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    }
  })

  if(existingUser) {
    c.status(400)
    return c.json({ error: 'Email already exists' });
  }

  try {
    const user = await prisma.user.create({ data: { email: body.email, password: body.password } })
    if(!user) { 
        return c.text('user not created') 
    }
    
    console.log('SECRET:', c.env.SECRET);
    console.log('DATABASE:', c.env.DATABASE_URL);
    
    const token = await sign({ id: user.id }, c.env.SECRET) 
    return c.json({ jwt: token })
  } catch (error) {
    console.error(error)
    if(error) { 
      return c.text ('unable to generate token')
    }  
  }
})


app.post('/api/v1/signin', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })

  if(!user) {
    c.status(403);
    return c.json({
      error: 'user does not exist'
    })
  }
  //@ts-ignore
  const jwt = await sign({ id: user.id }, c.env.SECRET)
  return c.json({ jwt }); 
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
