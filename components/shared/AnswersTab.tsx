import Pagination from "@/components/shared/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";

import { getUserAnswers } from "@/lib/actions/user.action";

import type { UserId } from "@/lib/actions/shared.types";
import type { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps, UserId {
  clerkId?: string | null;
}
const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.answers.map((answer: any) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default AnswersTab;
