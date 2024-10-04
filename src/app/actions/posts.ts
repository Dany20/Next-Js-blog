/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/actions/posts.ts

// this is a server action
"use server";

// Import the database client and the Post type from Prisma
import { db } from "@/db";
import type { Post } from "@prisma/client";

// Import the revalidatePath and redirect functions from Next.js
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Import the Zod library for validation
import { z } from "zod";

// Define a schema for the post using Zod
const postSchema = z.object({
  // the title must be a string between 3 and 255 characters
  title: z.string().min(3).max(255),
  // the content ust be a string between 10 and 4000 characters
  content: z.string().min(10).max(4000),
});

// Define an interface for the form state
interface PostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

// Define an asynchronous function to create a post
export async function createPost(
  formState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const result = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  revalidatePath("/");
  redirect("/");
}

export async function updatePost(
  id: string,
  formState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const result = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  let post: Post;
  try {
    post = await db.post.update({
      where: { id },
      data: {
        title: result.data.title,
        content: result.data.content,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  revalidatePath("/");
  redirect("/");
}

export async function deletePost(id: string): Promise<PostFormState> {
  let post: Post;
  try {
    post = await db.post.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  revalidatePath("/");
  redirect("/");
}
