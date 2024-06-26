import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    SECRET: string;
    DATABASE_URL: string;
  };
  Variables: {
    userId: number;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    c.status(401);
    console.log("error in auth verification")
    return c.json({ error: "unauthorized" });
  }

  const token = authHeader;
  const response = await verify(token, c.env.SECRET);

  if (!response.id) {
    c.status(403);
    c.json({ error: "unauthorized" });
  } else {
    c.set('jwtPayload', response.id);
    await next();
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const userId = c.get('jwtPayload');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: parseInt(userId),
      published: true
    },
  });
  
  console.log("blog created successfully");

  return c.json({
    id: blog.id,
  });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.blog.findMany({select: {
    id: true,
    title: true,
    content: true,
    author: {
        select: {
            name: true
        }
    }
}});
  return c.json({
    blogs,
  });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    console.log("fetching blog");
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      }, select: {
        id: true,
        title: true,
        content: true,
        author: {
            select: {
                name: true
            }
        }
    }
    });

    if (!blog) {
      c.status(404);
      return c.json({
        message: "Blog not found",
      });
    }

    console.log(blog);
    return c.json({
      blog
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog",
    });
  }
});


