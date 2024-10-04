// src/db/queries/posts.ts

import type { Post } from "@prisma/client"; // Importing the Post type from the @prisma/client package
import { db } from '@/db'
import { notFound } from "next/navigation"; // Import the notFound function from the next/navigation package for handling 404 errors.

export async function fetchPosts(): Promise<Post[]> {
    return await db.post.findMany({
        orderBy: [
            {
                updatedAt: "desc",
            }
        ],
    });
}

export async function fetchPostById(id: string): Promise<Post | null> {
    const post = await db.post.findFirst({
        where: {
            id
        }
    })

    if(!post) {
        notFound()
    }

    return post
}