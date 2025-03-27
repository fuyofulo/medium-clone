import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    SECRET: string;
    DATABASE_URL: string;
  };
}>();

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://medium-clone-six-livid.vercel.app",
    ],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.post("/haha", (c) => {
  return c.text("haha");
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
