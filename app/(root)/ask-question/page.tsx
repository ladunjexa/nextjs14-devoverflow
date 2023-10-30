import { auth } from "@clerk/nextjs";

import Question from "@/components/forms/Question";

import { getUserById } from "@/lib/actions/user.action";

type Props = {};

const Page = async (props: Props) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>

      <div className="mt-9">
        <Question type="create" mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default Page;
