import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput } from "@fuyofulo/medium-clone-common";

export const userRouter = new Hono<{
  Bindings: {
    SECRET: string;
    DATABASE_URL: string;
  };
}>();

// Add a test route to verify routing is working
userRouter.get("/test", async (c) => {
  console.log("Test route hit!");
  return c.json({ message: "User router is working!" });
});

// Add database connection test route
userRouter.get("/test-db", async (c) => {
  console.log("Testing database connection...");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Try to count users as a simple test
    const userCount = await prisma.user.count();
    return c.json({
      message: "Database connection successful!",
      userCount,
      databaseUrl: c.env.DATABASE_URL,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return c.json({
      error: "Database connection failed",
      details: (error as Error).message,
      databaseUrl: c.env.DATABASE_URL,
    });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.post("/signup", async (c) => {
  console.log("=== Signup endpoint hit ===");
  console.log("Request method:", c.req.method);
  console.log("Authorization header:", c.req.header("Authorization"));
  console.log("Content-Type header:", c.req.header("Content-Type"));
  console.log("Signup request received");
  console.log("Environment variables:", c.env);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  console.log("prisma client created successfully");

  try {
    const body = await c.req.json();
    console.log("Received signup data:", body);

    const { success } = signupInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "inputs are incorrect" });
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

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    if (!user) {
      c.status(500);
      return c.json({ error: "Failed to create user" });
    }

    const jwt = await sign({ id: user.id }, c.env.SECRET);
    return c.json({
      jwt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    c.status(500);
    return c.json({
      error: "Internal Server Error",
      details: (error as Error).message,
    });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.post("/signin", async (c) => {
  console.log("signin request received");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    console.log("Received signin data:", body);

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        error: "User does not exist",
      });
    }

    if (user.password !== body.password) {
      c.status(401);
      return c.json({
        error: "Invalid password",
      });
    }

    const jwt = await sign({ id: user.id }, c.env.SECRET);
    return c.json({ jwt });
  } catch (error) {
    console.error("Error during signin:", error);
    c.status(500);
    return c.json({
      error: "Internal Server Error",
      details: (error as Error).message,
    });
  } finally {
    await prisma.$disconnect();
  }
});
