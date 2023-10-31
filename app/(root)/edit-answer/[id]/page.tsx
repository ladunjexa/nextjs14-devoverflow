import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Answer from "@/components/forms/Answer";

import { getUserById } from "@/lib/actions/user.action";
import { getAnswerById } from "@/lib/actions/answer.action";

import type { ParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Answer — DevOverflow",
};

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  if (!mongoUser?.onboarded) redirect("/onboarding");

  const result = await getAnswerById({ answerId: params.id });

  if (userId !== result.author.clerkId) redirect("/");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Answer</h1>
      <div className="mt-9">
        <Answer
          type="Edit"
          question={result.content}
          questionId={JSON.stringify(result.question)}
          authorId={JSON.stringify(result.author)}
          answerData={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
