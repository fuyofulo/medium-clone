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

// CORS middleware with dynamic origin handling
app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return "*";

      // Allow localhost and Vercel deployments
      if (
        origin.includes("localhost") ||
        origin.includes("medium-clone") ||
        origin.endsWith(".vercel.app")
      ) {
        return origin;
      }

      return null; // Block other origins
    },
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
