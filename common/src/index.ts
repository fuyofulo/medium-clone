import z from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  name: z.string().optional(),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.number(),
});



//type inference in zod
export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
