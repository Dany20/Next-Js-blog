// src/app/posts/[id]/edit/page.tsx
// The [id] in the folder name indicates that this is a dynamic route, corresponding to a specific post ID.

import { updatePost } from "@/app/actions/posts";
import PostForm from "@/components/post-form";
import { fetchPostById } from "@/db/queries/posts";
import { title } from "process";

interface PostEditProps {
    params: {
        id: string;
    };
}

// Defining a new page, server component PostEdit
export default async function PostEdit({ params }: PostEditProps) {
    const { id } = params;

    // Fetch the post from the database
    const post = await fetchPostById(id);

    // bind the id to the updatePost action to create an updateAction
    const updateAction = updatePost.bind(null, id);

    return (
        <main className="flex min-h-screen flex-col items-start p-24">
            <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                <PostForm formAction={updateAction} initialData={{ title: post?.title ?? '', content: post?.content ?? ''}} />
            </div>
        </main>
    );
}