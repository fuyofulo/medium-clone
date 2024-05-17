import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/user/signup', (c) => {
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
