import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput } from '@fuyofulo/medium-clone-common';

export const userRouter = new Hono<{
  Bindings: {
    SECRET: string;
    DATABASE_URL: string;
  };
}>();

userRouter.post("/signup", async (c) => {

  console.log(c.env);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  console.log("prisma client created successfully");

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if(!success) {
    c.status(411)
    return c.json({
      message: 'inputs are incorrect'
    })
  }
  console.log("inputs are correct");
  
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser) {
    c.status(400);
    return c.json({ error: "Email already exists" });
  }

  try {
    const user = await prisma.user.create({
      data: { email: body.email, password: body.password },
    });
    if (!user) {
      return c.text("user not created");
    }

    const token = await sign({ id: user.id }, c.env.SECRET);
    return c.json({ jwt: token });
  } catch (error) {
    console.error(error);
    if (error) {
      return c.text("unable to generate token");
    }
  }
});

userRouter.post("/signin", async (c) => {

  console.log('signin request received');

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });


  if (!user) {
    c.status(505);
    return c.json({
      error: "user does not exist",
    });
  }
  const jwt = await sign({ id: user.id }, c.env.SECRET);
  return c.json({ jwt });
});
